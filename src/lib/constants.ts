import { EvaluationParameter, SystemSettings } from "./types";

export const DEFAULT_SETTINGS: SystemSettings = {
  companyName: "Wysbryx Technologies",
  logoUrl: "/wysbryx-mark.png",
  maxScore: 100,
  minScore: 0,
  ratingScale: 5,
  activeQuarter: "Q3",
  activeYear: 2026,
  gradeBoundaries: [
    { grade: "A+", label: "Outstanding", minScore: 95, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { grade: "A", label: "Excellent", minScore: 90, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { grade: "B+", label: "Very Good", minScore: 85, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    { grade: "B", label: "Good", minScore: 75, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { grade: "C", label: "Average", minScore: 65, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { grade: "D", label: "Needs Improvement", minScore: 55, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
    { grade: "F", label: "Critical Risk", minScore: 0, color: "text-rose-600", bg: "bg-rose-600/10", border: "border-rose-600/30" },
  ],
};

export function calculateEvaluationGrade(score: number) {
  const boundary = DEFAULT_SETTINGS.gradeBoundaries.find((b) => score >= b.minScore) || DEFAULT_SETTINGS.gradeBoundaries[DEFAULT_SETTINGS.gradeBoundaries.length - 1];
  return boundary;
}

export const EVALUATION_PARAMETERS: EvaluationParameter[] = [
  {
    id: "param_1",
    key: "ai_usage",
    name: "AI Usage Guidelines",
    description: "How responsibly and effectively the engineer leverages AI capabilities.",
    weight: 15,
    category: "Technical",
    submetrics: [
      "Responsible prompting",
      "Code & output verification",
      "Security awareness & zero secrets leakage",
      "Data privacy compliance",
      "Original architectural thinking",
      "Proper automated validation"
    ],
  },
  {
    id: "param_2",
    key: "engineering_knowledge",
    name: "Engineering Knowledge",
    description: "Depth of core technical principles, architectural patterns, and execution quality.",
    weight: 15,
    category: "Technical",
    submetrics: [
      "System architecture design",
      "Adherence to coding standards",
      "Clean, readable & modular code",
      "Design patterns application",
      "Tech stack proficiency",
      "Refactoring skills"
    ],
  },
  {
    id: "param_3",
    key: "subject_expertise",
    name: "Subject Expertise",
    description: "Domain knowledge, system internals, and deep problem-solving skills.",
    weight: 15,
    category: "Technical",
    submetrics: [
      "Domain & vertical knowledge",
      "Debugging complex bugs",
      "Performance profiling",
      "Database tuning & queries",
      "Security best practices"
    ],
  },
  {
    id: "param_4",
    key: "team_player",
    name: "Team Player & Mentorship",
    description: "Collaboration, peer code reviews, helping teammates, and uplifting engineering culture.",
    weight: 15,
    category: "Behavioral",
    submetrics: [
      "Thorough code reviews",
      "Mentoring junior engineers",
      "Knowledge sharing & tech talks",
      "Cross-functional collaboration",
      "Empathy & team communication"
    ],
  },
  {
    id: "param_5",
    key: "communication",
    name: "Communication & Transparency",
    description: "Written specs, Slack updates, escalation clarity, and active listening.",
    weight: 10,
    category: "Behavioral",
    submetrics: [
      "Clear technical documentation",
      "Proactive status updates",
      "Effective issue escalation",
      "Active listening in syncs"
    ],
  },
  {
    id: "param_6",
    key: "ownership",
    name: "Ownership & Initiative",
    description: "Taking full responsibility for features, driving tasks to done, and proactive fixes.",
    weight: 10,
    category: "Execution",
    submetrics: [
      "End-to-end feature ownership",
      "Proactive technical debt fixes",
      "Accountability when bugs occur",
      "Driving unblockers independently"
    ],
  },
  {
    id: "param_7",
    key: "sprint_delivery",
    name: "Sprint Delivery & Velocity",
    description: "Meeting sprint commitments, predictable velocity, and low post-release bugs.",
    weight: 10,
    category: "Execution",
    submetrics: [
      "Sprint commitment completion rate",
      "Production deployment reliability",
      "Minimal post-release bug rates",
      "On-time deliverable execution"
    ],
  },
  {
    id: "param_8",
    key: "learning",
    name: "Continuous Learning",
    description: "Upskilling, pursuing certifications, research, and running tech sharing sessions.",
    weight: 10,
    category: "Growth",
    submetrics: [
      "Proactive upskilling in new technologies",
      "Relevant technical certifications",
      "Leading tech talks & lunch-and-learns",
      "R&D into emergent tools & paradigms"
    ],
  },
];

// The real team's departments and roles, shared by World 1 and World 2.
// People are assigned to them in rotation (see ai-eval/allocation.ts) until
// real departments are recorded.
export const DEPARTMENT_NAMES = ["Engineering", "AI R&D", "Platform", "Product", "Quality Assurance", "DevOps"];
export const ROLE_NAMES = ["Senior Software Engineer", "AI Research Engineer", "Frontend Specialist", "Backend Architect", "Fullstack Developer", "QA Automation Lead"];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const DEPT_CODES: Record<string, string> = { Engineering: "ENG", "AI R&D": "AIRD", Platform: "PLAT", Product: "PROD", "Quality Assurance": "QA", DevOps: "OPS" };

export const DEPARTMENTS = DEPARTMENT_NAMES.map((name) => ({ id: `dept_${slug(name)}`, name, code: DEPT_CODES[name] }));

// One team per department until real teams exist.
export const TEAMS = DEPARTMENTS.map((d) => ({ id: d.id.replace("dept_", "team_"), name: `${d.name} Team`, departmentId: d.id, captainId: "", captainName: "" }));

export const DESIGNATIONS = ROLE_NAMES.map((title, i) => ({ id: `desig_${i + 1}`, title, level: "" }));

export const departmentIdFor = (name: string) => `dept_${slug(name)}`;
export const teamIdFor = (name: string) => `team_${slug(name)}`;
