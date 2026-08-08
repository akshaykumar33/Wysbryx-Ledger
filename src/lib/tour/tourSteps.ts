import { TourStep } from "./types";

// ═══════════════════════════════════════════════════════════
//  Unified tour covering World 1 + World 2
//  skipIfMissing steps auto-skip when their target isn't in DOM
// ═══════════════════════════════════════════════════════════

export const TOUR_STEPS: TourStep[] = [
  // ── Portal Landing ────────────────────────────────────────
  {
    id: "welcome",
    target: '[data-tour="welcome-hero"]',
    title: "👋 Welcome to Wysbryx Intel",
    description: "Let's walk through the entire platform — both evaluation worlds.",
    action: "next",
    route: "/",
    placement: "bottom",
    world: "global",
  },
  {
    id: "ai-eval-entry",
    target: '[data-tour="ai-eval-button"]',
    title: "Enter World 1",
    description: "Click to open the AI competency evaluation workspace.",
    action: "click",
    actionPrompt: "Click Wysbryx AI Eval",
    route: "/",
    placement: "top",
    world: "world1",
  },

  // ── World 1: AI Evaluation ────────────────────────────────
  {
    id: "evaluator-name",
    target: '[data-tour="evaluator-name-input"]',
    title: "Enter Your Name",
    description: "Type your name to identify yourself as an evaluator.",
    action: "input",
    actionPrompt: "Type your name",
    route: "/ai-eval",
    placement: "bottom",
    world: "world1",
    skipIfMissing: true,
  },
  {
    id: "continue-roll",
    target: '[data-tour="continue-to-roll-btn"]',
    title: "Continue to Roll",
    description: "Submit your identity and proceed to candidate allocation.",
    action: "click",
    actionPrompt: "Click Continue to Roll",
    route: "/ai-eval",
    placement: "top",
    world: "world1",
    skipIfMissing: true,
  },
  {
    id: "roll-pool",
    target: '[data-tour="roll-pool-btn"]',
    title: "Roll Candidate Pool",
    description: "Click to randomly allocate your candidate pool.",
    action: "click",
    actionPrompt: "Click ROLL CANDIDATE POOL NOW",
    route: "/ai-eval",
    placement: "top",
    world: "world1",
    skipIfMissing: true,
  },
  {
    id: "candidate-audit",
    target: '[data-tour="first-candidate-audit-btn"]',
    title: "Audit a Candidate",
    description: "Click AI Audit to open a candidate's competency rubrics.",
    action: "click",
    actionPrompt: "Click AI Audit",
    route: "/ai-eval",
    placement: "left",
    world: "world1",
  },

  // ── World 1 → World 2 Transition ─────────────────────────
  {
    id: "world-switch",
    target: '[data-tour="world-switch-w2-btn"]',
    title: "Switch to World 2",
    description: "Click to enter the executive ledger suite — dashboard, evaluations & analytics.",
    action: "click",
    actionPrompt: "Click Switch to World 2",
    route: "/ai-eval",
    placement: "bottom",
    world: "world2",
  },

  // ── World 2: Executive Suite ──────────────────────────────
  {
    id: "dashboard-metrics",
    target: '[data-tour="dashboard-overview"]',
    title: "Executive Dashboard",
    description: "View overall metrics, radar charts, and organizational performance.",
    action: "next",
    route: "/dashboard",
    placement: "bottom",
    world: "world2",
  },
  {
    id: "engineers-roster",
    target: '[data-tour="engineers-search-section"]',
    title: "Engineers Directory",
    description: "Browse talent profiles, filter by department, and manage scorecards.",
    action: "next",
    route: "/engineers",
    placement: "bottom",
    world: "world2",
  },
  {
    id: "evaluations-workspace",
    target: '[data-tour="evaluations-header"]',
    title: "Evaluations Workspace",
    description: "Review and issue quarterly performance evaluations.",
    action: "next",
    route: "/evaluations",
    placement: "bottom",
    world: "world2",
  },
  {
    id: "analytics-page",
    target: '[data-tour="analytics-overview"]',
    title: "Skill Gap Analytics",
    description: "Analyze organization-wide skill matrix and performance breakdown.",
    action: "next",
    route: "/analytics",
    placement: "bottom",
    world: "world2",
  },
  {
    id: "settings-page",
    target: '[data-tour="settings-theme-selector"]',
    title: "Engine Settings",
    description: "Customize theme accents, evaluation cycles, and score boundaries.",
    action: "next",
    route: "/settings",
    placement: "bottom",
    world: "world2",
  },

  // ── Completion ────────────────────────────────────────────
  {
    id: "tour-complete",
    target: "center",
    title: "🎉 Tour Complete!",
    description: "You've explored everything. Restart anytime from the Compass icon.",
    action: "next",
    placement: "center",
    world: "global",
  },
];
