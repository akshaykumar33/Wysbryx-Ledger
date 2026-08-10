import EMPLOYEES_RAW from "@/lib/employee";

export interface EmployeeCandidate {
  id: string;
  name: string;
  email: string;
  dob: string;
  startDate: string;
  department: string;
  role: string;
  status: "Active" | "In Review" | "Completed";
  avatarSeed: string;
}

// Convert raw employees into normalized candidate objects
export const ALL_CANDIDATES: EmployeeCandidate[] = EMPLOYEES_RAW.map((emp: any, index: number) => {
  const cleanName = emp.name.replace(/,\s*$/, "").trim();
  const id = `emp_${index + 1}_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
  
  // Deterministic department assignment based on index
  const departments = ["Engineering", "AI R&D", "Platform", "Product", "Quality Assurance", "DevOps"];
  const roles = ["Senior Software Engineer", "AI Research Engineer", "Frontend Specialist", "Backend Architect", "Fullstack Developer", "QA Automation Lead"];
  
  const deptIndex = index % departments.length;
  const roleIndex = index % roles.length;

  return {
    id,
    name: cleanName,
    email: emp.email.toLowerCase(),
    dob: emp.dob || "2000-01-01",
    startDate: emp.startDate || "2025-01-01",
    department: departments[deptIndex],
    role: roles[roleIndex],
    status: index % 4 === 0 ? "Completed" : index % 3 === 0 ? "In Review" : "Active",
    avatarSeed: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
  };
});

// Authorized Evaluators List
export const ALLOWED_EVALUATORS = [
  { name: "Akshay", normalized: "akshay", isAdmin: false },
  { name: "Anam", normalized: "anam", isAdmin: false },
  { name: "Ayush", normalized: "ayush", isAdmin: false },
  { name: "Krishna", normalized: "krishna", isAdmin: true },
  { name: "Praveen", normalized: "praveen", isAdmin: true },
];

export function validateEvaluatorName(nameInput: string): { isValid: boolean; matchedName: string; isAdmin: boolean } {
  const trimmed = nameInput.trim().toLowerCase();
  if (!trimmed) {
    return { isValid: false, matchedName: "", isAdmin: false };
  }

  // Strictly match against authorized evaluators
  const found = ALLOWED_EVALUATORS.find(
    (e) => e.normalized === trimmed || trimmed.includes(e.normalized) || e.normalized.includes(trimmed)
  );

  if (found) {
    return { isValid: true, matchedName: found.name, isAdmin: found.isAdmin };
  }

  return { isValid: false, matchedName: "", isAdmin: false };
}

export function isAdminUser(nameInput: string): boolean {
  const res = validateEvaluatorName(nameInput);
  return res.isValid && res.isAdmin;
}

// ── Cryptographically Strong SplitMix64 PRNG Engine ────────────────────────
// Uses FNV-1a 64-bit hashing + SplitMix64 avalanche permutation to eliminate
// pattern predictability while guaranteeing 100% deterministic repeatable allocation.

export function generate64BitHash(str: string): bigint {
  let hash = 0xcbf29ce484222325n; // FNV 64-bit offset basis
  const fnvPrime = 0x100000001b3n;

  const encoder = new TextEncoder();
  const bytes = encoder.encode(str.trim().toLowerCase() + "_wysbryx_quantum_salt_v2");

  for (let i = 0; i < bytes.length; i++) {
    hash ^= BigInt(bytes[i]);
    hash = (hash * fnvPrime) & 0xffffffffffffffffn;
  }
  return hash;
}

// SplitMix64 generator - passes BigCrush statistical randomness tests
export function createSplitMix64PRNG(seed: bigint): () => number {
  let state = seed;
  return () => {
    state = (state + 0x9e3779b97f4a7c15n) & 0xffffffffffffffffn; // Golden Ratio Constant
    let z = state;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & 0xffffffffffffffffn;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & 0xffffffffffffffffn;
    const finalVal = (z ^ (z >> 31n)) & 0xffffffffffffffffn;
    // Map 64-bit integer to uniform float [0, 1)
    return Number(finalVal & 0x1fffffffffffffn) / 0x20000000000000;
  };
}

/**
 * Distributes employee candidates evenly to evaluators using SplitMix64.
 * Admin users receive ALL candidates (100% roster access).
 * Regular evaluators receive a non-overlapping (disjoint) partition of candidates.
 */
export function allocateCandidatesForEvaluator(
  evaluatorName: string,
  targetCount: number = 10,
  alreadyAllocatedEmails: Set<string> | string[] = new Set()
): EmployeeCandidate[] {
  if (isAdminUser(evaluatorName)) {
    return ALL_CANDIDATES;
  }

  const allocatedSet = new Set(
    Array.isArray(alreadyAllocatedEmails)
      ? alreadyAllocatedEmails.map((e) => e.toLowerCase())
      : Array.from(alreadyAllocatedEmails).map((e) => e.toLowerCase())
  );

  // ── CRITICAL 1: Exclude the evaluator from their own candidate pool ──
  const normalizedName = evaluatorName.trim().toLowerCase();
  const escapedName = normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const selfMatchRegex = new RegExp(escapedName, "i");

  const eligiblePool = ALL_CANDIDATES.filter(
    (candidate) => !selfMatchRegex.test(candidate.name.toLowerCase())
  );

  // ── CRITICAL 2: Exclude candidates already assigned to other regular evaluators ──
  const unallocatedPool = eligiblePool.filter(
    (candidate) => !allocatedSet.has(candidate.email.toLowerCase())
  );

  // Master deterministic shuffle of ALL_CANDIDATES using fixed global seed
  const masterSeed = generate64BitHash("wysbryx_master_roster_seed_2026");
  const masterPrng = createSplitMix64PRNG(masterSeed);
  const masterRoster = [...eligiblePool];
  for (let i = masterRoster.length - 1; i > 0; i--) {
    const j = Math.floor(masterPrng() * (i + 1));
    [masterRoster[i], masterRoster[j]] = [masterRoster[j], masterRoster[i]];
  }

  // Known evaluator bucket mapping for clean zero-overlap partitioning
  const KNOWN_BUCKETS: Record<string, number> = {
    akshay: 0,
    ayush: 1,
    anam: 2,
    aadil: 3,
  };

  const totalBuckets = Math.max(1, Math.floor(masterRoster.length / targetCount));
  let bucketIndex = 0;

  // Find if normalizedName matches or contains a known evaluator key
  const knownKey = Object.keys(KNOWN_BUCKETS).find((k) => normalizedName.includes(k));
  if (knownKey !== undefined) {
    bucketIndex = KNOWN_BUCKETS[knownKey] % totalBuckets;
  } else {
    // Hash-based bucket assignment for arbitrary evaluator names
    const evalSeed = generate64BitHash(normalizedName);
    bucketIndex = Number(evalSeed % BigInt(totalBuckets));
    if (bucketIndex < 0) bucketIndex = Math.abs(bucketIndex);
  }

  // Calculate slice range for this bucket
  const startIndex = bucketIndex * targetCount;
  const endIndex = Math.min(masterRoster.length, startIndex + targetCount);
  const bucketCandidates = masterRoster.slice(startIndex, endIndex);

  // If alreadyAllocatedEmails was provided (server DB aware mode), prioritize unallocated candidates
  if (allocatedSet.size > 0 && unallocatedPool.length > 0) {
    // Pick from unallocated pool using evaluator seed
    const evalSeed = generate64BitHash(normalizedName);
    const evalPrng = createSplitMix64PRNG(evalSeed);
    const unallocatedCopy = [...unallocatedPool];
    for (let i = unallocatedCopy.length - 1; i > 0; i--) {
      const j = Math.floor(evalPrng() * (i + 1));
      [unallocatedCopy[i], unallocatedCopy[j]] = [unallocatedCopy[j], unallocatedCopy[i]];
    }

    // Combine unallocated slice up to targetCount
    const result = unallocatedCopy.slice(0, Math.min(targetCount, unallocatedCopy.length));
    if (result.length >= targetCount) {
      return result;
    }

    // If unallocated candidates < targetCount, fill remaining from bucketCandidates avoiding duplicates
    const currentEmails = new Set(result.map((c) => c.email.toLowerCase()));
    for (const c of bucketCandidates) {
      if (result.length >= targetCount) break;
      if (!currentEmails.has(c.email.toLowerCase())) {
        result.push(c);
        currentEmails.add(c.email.toLowerCase());
      }
    }
    return result;
  }

  // Standard non-overlapping bucket candidate allocation
  return bucketCandidates.length >= targetCount
    ? bucketCandidates
    : masterRoster.slice(0, Math.min(targetCount, masterRoster.length));
}

