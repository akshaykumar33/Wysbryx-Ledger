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

// Deterministic Pseudo-Random Seeded Shuffle for Equal Distribution
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateSeededHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Distributes employee candidates evenly to evaluators.
 * Admin users receive ALL candidates.
 * Regular evaluators receive a fair partition (e.g. 10 candidates per evaluator).
 */
export function allocateCandidatesForEvaluator(
  evaluatorName: string,
  targetCount: number = 10
): EmployeeCandidate[] {
  if (isAdminUser(evaluatorName)) {
    return ALL_CANDIDATES;
  }

  const hashSeed = generateSeededHash(evaluatorName.toLowerCase());
  const candidatesCopy = [...ALL_CANDIDATES];

  // Fisher-Yates shuffle with deterministic seed
  let currentSeed = hashSeed;
  for (let i = candidatesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
    [candidatesCopy[i], candidatesCopy[j]] = [candidatesCopy[j], candidatesCopy[i]];
  }

  // Return the allocated slice (e.g., 10 candidates)
  return candidatesCopy.slice(0, Math.min(targetCount, candidatesCopy.length));
}
