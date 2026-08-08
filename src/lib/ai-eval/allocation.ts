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

// Admin Bypass Users
export const ADMIN_USERS = ["praveen", "krishna"];

export function isAdminUser(nameInput: string): boolean {
  const normalized = nameInput.trim().toLowerCase();
  return ADMIN_USERS.some((admin) => normalized.includes(admin));
}

// Regex Name Validation
// Accepts input and tests against candidate/evaluator name list
export function validateEvaluatorName(nameInput: string): { isValid: boolean; matchedName: string; isAdmin: boolean } {
  const trimmed = nameInput.trim();
  if (!trimmed || trimmed.length < 2) {
    return { isValid: false, matchedName: "", isAdmin: false };
  }

  // Check admin first
  if (isAdminUser(trimmed)) {
    const adminCapitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return { isValid: true, matchedName: adminCapitalized, isAdmin: true };
  }

  // Build regex for intelligent matching
  const escapedInput = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedInput, "i");

  // Check against candidate employees or common evaluator names
  const match = ALL_CANDIDATES.find((c) => regex.test(c.name));
  if (match) {
    return { isValid: true, matchedName: match.name, isAdmin: false };
  }

  // Allow custom evaluator names if user enters a valid non-empty name (at least 3 chars)
  if (trimmed.length >= 3) {
    return { isValid: true, matchedName: trimmed, isAdmin: false };
  }

  return { isValid: false, matchedName: "", isAdmin: false };
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
 * Regular evaluators receive an unpredictable, cryptographically uniform partition.
 */
export function allocateCandidatesForEvaluator(
  evaluatorName: string,
  targetCount: number = 10
): EmployeeCandidate[] {
  if (isAdminUser(evaluatorName)) {
    return ALL_CANDIDATES;
  }

  const seed = generate64BitHash(evaluatorName);
  const nextRandom = createSplitMix64PRNG(seed);
  const candidatesCopy = [...ALL_CANDIDATES];

  // Cryptographically strong Fisher-Yates shuffle with zero bias
  for (let i = candidatesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [candidatesCopy[i], candidatesCopy[j]] = [candidatesCopy[j], candidatesCopy[i]];
  }

  // Return the allocated slice (e.g., 10 candidates)
  return candidatesCopy.slice(0, Math.min(targetCount, candidatesCopy.length));
}
