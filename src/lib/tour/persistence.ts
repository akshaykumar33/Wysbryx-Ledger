import { TourStateData, TourStatus } from "./types";

const TOUR_STORAGE_KEY = "wysbryx_tour_state_v1";

const DEFAULT_STATE: TourStateData = {
  status: "not_started",
  currentStepIndex: 0,
  completedAt: null,
  skippedAt: null,
};

export function getPersistedTourState(): TourStateData {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const raw = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as TourStateData;
    return {
      status: parsed.status || "not_started",
      currentStepIndex: typeof parsed.currentStepIndex === "number" ? parsed.currentStepIndex : 0,
      completedAt: parsed.completedAt || null,
      skippedAt: parsed.skippedAt || null,
    };
  } catch (err) {
    console.warn("Failed to load tour state from localStorage:", err);
    return DEFAULT_STATE;
  }
}

export function savePersistedTourState(state: Partial<TourStateData>): TourStateData {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const current = getPersistedTourState();
    const updated: TourStateData = {
      ...current,
      ...state,
    };
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to save tour state to localStorage:", err);
    return DEFAULT_STATE;
  }
}

export function clearPersistedTourState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear tour state:", err);
  }
}
