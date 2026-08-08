import { create } from "zustand";
import { TourStep, TourStatus, ElementRect } from "./types";
import { TOUR_STEPS } from "./tourSteps";
import { getPersistedTourState, savePersistedTourState } from "./persistence";
import { getElementRect } from "./routeTourResolver";

interface TourStoreState {
  isActive: boolean;
  status: TourStatus;
  stepIndex: number;
  steps: TourStep[];
  activeStep: TourStep | null;
  targetElement: HTMLElement | null;
  targetRect: ElementRect | null;
  isSearchingTarget: boolean;
  isActionWaiting: boolean;
  
  // Store methods
  initTourState: () => void;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  skipTour: () => void;
  completeTour: () => void;
  restartTour: () => void;
  setTargetElement: (el: HTMLElement | null) => void;
  updateTargetRect: () => void;
  handleActionTriggered: (actionType: string, triggeredTarget?: string) => void;
}

export const useTourStore = create<TourStoreState>((set, get) => ({
  isActive: false,
  status: "not_started",
  stepIndex: 0,
  steps: TOUR_STEPS,
  activeStep: null,
  targetElement: null,
  targetRect: null,
  isSearchingTarget: false,
  isActionWaiting: false,

  initTourState: () => {
    const persisted = getPersistedTourState();
    const activeStep = TOUR_STEPS[persisted.currentStepIndex] || TOUR_STEPS[0];
    const isFirstTime = persisted.status === "not_started";
    const isInProgress = persisted.status === "in_progress";

    set({
      status: persisted.status,
      stepIndex: persisted.currentStepIndex,
      activeStep,
      isActive: isFirstTime || isInProgress,
    });
  },

  startTour: () => {
    const firstStep = TOUR_STEPS[0];
    savePersistedTourState({ status: "in_progress", currentStepIndex: 0 });
    set({
      isActive: true,
      status: "in_progress",
      stepIndex: 0,
      activeStep: firstStep,
      targetElement: null,
      targetRect: null,
    });
  },

  nextStep: () => {
    const { stepIndex, steps } = get();
    const nextIdx = stepIndex + 1;

    if (nextIdx >= steps.length) {
      get().completeTour();
      return;
    }

    const nextStepObj = steps[nextIdx];
    savePersistedTourState({ status: "in_progress", currentStepIndex: nextIdx });
    set({
      stepIndex: nextIdx,
      activeStep: nextStepObj,
      targetElement: null,
      targetRect: null,
    });
  },

  prevStep: () => {
    const { stepIndex, steps } = get();
    const prevIdx = Math.max(0, stepIndex - 1);
    const prevStepObj = steps[prevIdx];
    savePersistedTourState({ status: "in_progress", currentStepIndex: prevIdx });
    set({
      stepIndex: prevIdx,
      activeStep: prevStepObj,
      targetElement: null,
      targetRect: null,
    });
  },

  goToStep: (index: number) => {
    const { steps } = get();
    if (index < 0 || index >= steps.length) return;
    savePersistedTourState({ status: "in_progress", currentStepIndex: index });
    set({
      stepIndex: index,
      activeStep: steps[index],
      targetElement: null,
      targetRect: null,
    });
  },

  skipTour: () => {
    savePersistedTourState({
      status: "skipped",
      skippedAt: new Date().toISOString(),
    });
    set({
      isActive: false,
      status: "skipped",
      targetElement: null,
      targetRect: null,
    });
  },

  completeTour: () => {
    savePersistedTourState({
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    set({
      isActive: false,
      status: "completed",
      targetElement: null,
      targetRect: null,
    });
  },

  restartTour: () => {
    savePersistedTourState({
      status: "in_progress",
      currentStepIndex: 0,
    });
    set({
      isActive: true,
      status: "in_progress",
      stepIndex: 0,
      activeStep: TOUR_STEPS[0],
      targetElement: null,
      targetRect: null,
    });
  },

  setTargetElement: (el: HTMLElement | null) => {
    if (!el) {
      set({ targetElement: null, targetRect: null });
      return;
    }
    const rect = getElementRect(el);
    set({ targetElement: el, targetRect: rect });
  },

  updateTargetRect: () => {
    const { targetElement } = get();
    if (targetElement) {
      const rect = getElementRect(targetElement);
      set({ targetRect: rect });
    }
  },

  handleActionTriggered: (actionType: string, triggeredTarget?: string) => {
    const { activeStep, isActive } = get();
    if (!isActive || !activeStep) return;

    if (activeStep.action === actionType || (activeStep.action === "input" && actionType === "change")) {
      // If triggeredTarget is provided, ensure it matches active step target selector pattern
      get().nextStep();
    }
  },
}));
