"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTourStore } from "@/lib/tour/store";
import {
  isRouteMatch,
  waitForTargetElement,
  scrollElementIntoViewIfNeeded,
} from "@/lib/tour/routeTourResolver";
import { TourOverlay } from "./TourOverlay";
import { TourPopover } from "./TourPopover";
import { AnimatePresence } from "framer-motion";

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isActive,
    activeStep,
    stepIndex,
    steps,
    targetElement,
    targetRect,
    initTourState,
    nextStep,
    prevStep,
    skipTour,
    setTargetElement,
    updateTargetRect,
    handleActionTriggered,
  } = useTourStore();

  // Track whether we already advanced from the current step to prevent double-fires
  const advancedRef = useRef<string | null>(null);

  // 1. Initialize store state on mount
  useEffect(() => {
    initTourState();
  }, [initTourState]);

  // Reset the advanced ref whenever the active step changes
  useEffect(() => {
    if (activeStep) {
      advancedRef.current = null;
    }
  }, [activeStep?.id]);

  // 2. Resolve target element when route or active step changes
  useEffect(() => {
    if (!isActive || !activeStep) return;

    let isMounted = true;

    const resolveStepTarget = async () => {
      // Check route matching
      if (activeStep.route && !isRouteMatch(pathname, activeStep.route)) {
        router.push(activeStep.route);
        return;
      }

      if (activeStep.target === "center") {
        setTargetElement(null);
        return;
      }

      // skipIfMissing steps get a fast timeout so we don't stall
      // Non-skippable steps get a longer timeout to wait for async renders (e.g. after roll animation)
      const timeoutMs = activeStep.skipIfMissing ? 800 : 4000;
      const el = await waitForTargetElement(activeStep.target, timeoutMs);
      if (!isMounted) return;

      if (el) {
        scrollElementIntoViewIfNeeded(el);
        setTargetElement(el);
      } else if (activeStep.skipIfMissing) {
        // Element genuinely not in DOM — skip to next step
        nextStep();
      } else {
        setTargetElement(null);
      }
    };

    resolveStepTarget();

    return () => {
      isMounted = false;
    };
  }, [isActive, activeStep, pathname, router, nextStep, setTargetElement]);

  // 3. Synchronous Action-gated event listeners
  useEffect(() => {
    if (!isActive || !activeStep || !targetElement) return;

    const handleUserClick = () => {
      if (activeStep.action === "click" && advancedRef.current !== activeStep.id) {
        advancedRef.current = activeStep.id;
        handleActionTriggered("click");
      }
    };

    const handleUserInput = () => {
      if (activeStep.action === "input" && advancedRef.current !== activeStep.id) {
        advancedRef.current = activeStep.id;
        handleActionTriggered("input");
      }
    };

    // Capture phase fires before React synthetic handlers
    targetElement.addEventListener("click", handleUserClick, { capture: true });
    targetElement.addEventListener("input", handleUserInput, { capture: true });
    targetElement.addEventListener("change", handleUserInput, { capture: true });

    return () => {
      targetElement.removeEventListener("click", handleUserClick, { capture: true });
      targetElement.removeEventListener("input", handleUserInput, { capture: true });
      targetElement.removeEventListener("change", handleUserInput, { capture: true });
    };
  }, [isActive, activeStep, targetElement, handleActionTriggered]);

  // 4. Update target rect on resize & scroll
  useEffect(() => {
    if (!isActive || !targetElement) return;

    const handleScrollOrResize = () => updateTargetRect();

    window.addEventListener("scroll", handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isActive, targetElement, updateTargetRect]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isActive && activeStep && (
          <>
            <TourOverlay targetRect={targetRect} world={activeStep.world} />
            <TourPopover
              step={activeStep}
              currentStepIndex={stepIndex}
              totalSteps={steps.length}
              targetRect={targetRect}
              onNext={nextStep}
              onPrev={prevStep}
              onSkip={skipTour}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
