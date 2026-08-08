export type TourStatus = "not_started" | "in_progress" | "completed" | "skipped";

export type TourAction = "next" | "click" | "input" | "select" | "navigate";

export type PopoverPlacement = "top" | "bottom" | "left" | "right" | "center" | "auto";

export type TourWorldTheme = "world1" | "world2" | "global";

export interface TourStep {
  id: string;
  target: string; // CSS selector, e.g. '[data-tour="ai-eval-button"]'
  title: string;
  description: string;
  action: TourAction;
  actionPrompt?: string; // e.g. "Click Wysbryx AI Eval"
  route?: string; // Target route where this element is located, e.g. "/" or "/ai-eval"
  placement?: PopoverPlacement;
  world?: TourWorldTheme; // "world1" (Amber) vs "world2" (Purple) vs "global"
  offset?: number;
  waitForElementMs?: number;
  skipIfMissing?: boolean;
}

export interface TourStateData {
  status: TourStatus;
  currentStepIndex: number;
  activeWorld?: TourWorldTheme;
  completedAt?: string | null;
  skippedAt?: string | null;
}

export interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}
