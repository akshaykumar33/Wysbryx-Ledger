import { EvaluationParameter, SystemSettings } from "./types";

export const DEFAULT_SETTINGS: SystemSettings = {
  companyName: "Wysbryx Technologies",
  logoUrl: "https://www.wysbryx.com/wysbryx_v.png",
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
      "Debugging & root-cause analysis",
      "Scalability & high performance"
    ],
  },
  {
    id: "param_3",
    key: "subject_expertise",
    name: "Subject Expertise",
    description: "Domain mastery, complex problem solving, and autonomous technical decision making.",
    weight: 15,
    category: "Technical",
    submetrics: [
      "Domain & stack mastery",
      "End-to-end component ownership",
      "Complex problem solving",
      "Industry best practices",
      "Data-driven technical decisions"
    ],
  },
  {
    id: "param_4",
    key: "communication",
    name: "Communication",
    description: "Clarity in written docs, tech specs, async communication, and presentations.",
    weight: 10,
    category: "Behavioral",
    submetrics: [
      "Technical documentation & specs",
      "Effective meeting participation",
      "Proactive knowledge sharing",
      "Clear written & async communication",
      "Presentation & demo clarity"
    ],
  },
  {
    id: "param_5",
    key: "team_player",
    name: "Team Player & Mentorship",
    description: "Cross-team collaboration, peer support, positive team culture, and mentoring.",
    weight: 15,
    category: "Behavioral",
    submetrics: [
      "Assisting team members in blocker resolution",
      "Active mentoring & onboarding",
      "Cross-functional collaboration",
      "Accountability & ownership",
      "Positive attitude & constructive feedback"
    ],
  },
  {
    id: "param_6",
    key: "innovation",
    name: "Innovation & Automation",
    description: "Driving proactive improvements, workflow automation, and innovative ideas.",
    weight: 10,
    category: "Growth",
    submetrics: [
      "Process & tooling improvement ideas",
      "DevOps & test automation initiatives",
      "Performance optimization spikes",
      "Proactive developer experience enhancement"
    ],
  },
  {
    id: "param_7",
    key: "delivery",
    name: "Delivery & Execution",
    description: "Reliability in meeting sprint commitments, code quality, and on-time execution.",
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

export const DEPARTMENTS = [
  { id: "dept_1", name: "Core Platform Engineering", code: "PLAT" },
  { id: "dept_2", name: "Frontend Architecture & UX", code: "FE" },
  { id: "dept_3", name: "Backend & Distributed Systems", code: "BE" },
  { id: "dept_4", name: "AI & Machine Learning Infrastructure", code: "AIML" },
  { id: "dept_5", name: "DevOps & Cloud Reliability", code: "SRE" },
];

export const TEAMS = [
  { id: "team_1", name: "API Gateway & Microservices", departmentId: "dept_3", captainId: "user_cap_1", captainName: "Elena Rostova" },
  { id: "team_2", name: "Design System & Web Apps", departmentId: "dept_2", captainId: "user_cap_2", captainName: "Marcus Vance" },
  { id: "team_3", name: "LLM Pipeline & Inference", departmentId: "dept_4", captainId: "user_cap_3", captainName: "Dr. Sarah Chen" },
  { id: "team_4", name: "Kubernetes & Infrastructure", departmentId: "dept_5", captainId: "user_cap_4", captainName: "David Miller" },
  { id: "team_5", name: "Data Lake & Analytics Engine", departmentId: "dept_1", captainId: "user_cap_1", captainName: "Elena Rostova" },
];
