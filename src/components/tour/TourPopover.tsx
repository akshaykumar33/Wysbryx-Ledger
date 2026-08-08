"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { TourStep, ElementRect, TourWorldTheme } from "@/lib/tour/types";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MousePointerClick,
  TextCursorInput,
  PartyPopper,
} from "lucide-react";

interface TourPopoverProps {
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  targetRect: ElementRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function TourPopover({
  step,
  currentStepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
}: TourPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 1024, h: 768 });

  const updateViewport = useCallback(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [updateViewport]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
      else if (e.key === "ArrowRight" && step.action === "next") onNext();
      else if (e.key === "ArrowLeft" && currentStepIndex > 0) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, currentStepIndex, onNext, onPrev, onSkip]);

  const isMobile = viewport.w < 640;
  const isTablet = viewport.w >= 640 && viewport.w < 1024;
  const world: TourWorldTheme = step.world || "global";
  const isW1 = world === "world1";
  const isW2 = world === "world2";

  const theme = useMemo(() => {
    if (isW1) return {
      accent: "text-amber-500",
      accentBg: "bg-amber-500",
      accentLight: "bg-amber-500/10",
      accentBorder: "border-amber-500/25",
      nextBtn: "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25",
      skipBtn: "text-amber-500/60 hover:text-amber-400",
      prevBtn: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20",
      bar: "bg-amber-500",
      glow: "shadow-amber-500/8",
    };
    if (isW2) return {
      accent: "text-purple-500",
      accentBg: "bg-purple-500",
      accentLight: "bg-purple-500/10",
      accentBorder: "border-purple-500/25",
      nextBtn: "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25",
      skipBtn: "text-purple-500/60 hover:text-purple-400",
      prevBtn: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20",
      bar: "bg-purple-500",
      glow: "shadow-purple-500/8",
    };
    return {
      accent: "text-cyan-500",
      accentBg: "bg-cyan-500",
      accentLight: "bg-cyan-500/10",
      accentBorder: "border-cyan-500/25",
      nextBtn: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25",
      skipBtn: "text-cyan-500/60 hover:text-cyan-400",
      prevBtn: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20",
      bar: "bg-cyan-500",
      glow: "shadow-cyan-500/8",
    };
  }, [isW1, isW2]);

  // Responsive positioning: bottom-sheet on mobile, smart-float on desktop
  const positionStyles = useMemo((): React.CSSProperties => {
    // Mobile → full-width bottom sheet
    if (isMobile) {
      return {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 50,
      };
    }

    // Center placement (tour-complete step)
    if (step.target === "center") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isTablet ? "340px" : "380px",
        maxWidth: "calc(100vw - 32px)",
        zIndex: 50,
      };
    }

    // Desktop/tablet → float near bottom-right, shift up if target is low
    const cardWidth = isTablet ? 320 : 360;
    const margin = 20;
    const isTargetLow = targetRect && targetRect.top > viewport.h * 0.55;

    return {
      position: "fixed",
      ...(isTargetLow ? { top: `${margin}px` } : { bottom: `${margin}px` }),
      right: `${margin}px`,
      width: `${cardWidth}px`,
      maxWidth: `calc(100vw - ${margin * 2}px)`,
      zIndex: 50,
    };
  }, [isMobile, isTablet, targetRect, viewport.h, step.target]);

  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  const isLast = currentStepIndex === totalSteps - 1;
  const isActionStep = step.action !== "next";
  const hasPrev = currentStepIndex > 0;

  return (
    <motion.div
      ref={popoverRef}
      key={step.id}
      initial={{ opacity: 0, y: isMobile ? 60 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isMobile ? 60 : 14 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={positionStyles}
      role="dialog"
      aria-modal="true"
      aria-label={`Tour step ${currentStepIndex + 1} of ${totalSteps}`}
      className={`
        pointer-events-auto font-sans select-none
        bg-white dark:bg-[#111113]
        border border-neutral-200/70 dark:border-neutral-800/70
        shadow-2xl ${theme.glow}
        ${isMobile ? "rounded-t-2xl" : "rounded-2xl"}
        overflow-hidden
      `}
    >
      {/* ── Progress bar ── */}
      <div className="h-[2px] bg-neutral-100 dark:bg-neutral-900">
        <motion.div
          className={`h-full ${theme.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* ── Content ── */}
      <div className={`${isMobile ? "px-4 pt-4 pb-2" : "px-5 pt-4 pb-2.5"}`}>
        {/* Header: step counter + close */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 tracking-widest tabular-nums uppercase">
            {currentStepIndex + 1} / {totalSteps}
          </span>
          <button
            onClick={onSkip}
            aria-label="Close tour"
            className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title */}
        <h3 className={`${isMobile ? "text-[14px]" : "text-[15px]"} font-bold text-neutral-900 dark:text-white leading-snug tracking-tight`}>
          {step.title}
        </h3>

        {/* Description */}
        <p className={`mt-1 ${isMobile ? "text-[12px]" : "text-[13px]"} text-neutral-500 dark:text-neutral-400 leading-relaxed`}>
          {step.description}
        </p>

        {/* Action hint pill */}
        {isActionStep && (
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${theme.accentLight} ${theme.accentBorder}`}>
            {step.action === "click" ? (
              <MousePointerClick className={`w-3 h-3 ${theme.accent} animate-bounce`} />
            ) : (
              <TextCursorInput className={`w-3 h-3 ${theme.accent} animate-pulse`} />
            )}
            <span className={`text-[10px] sm:text-[11px] font-semibold ${theme.accent}`}>
              {step.actionPrompt}
            </span>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className={`${isMobile ? "px-4 pb-5 pt-2" : "px-5 pb-4 pt-2"} flex items-center justify-between`}>
        {/* Skip */}
        <button
          onClick={onSkip}
          className={`text-[11px] sm:text-[12px] font-medium ${theme.skipBtn} transition-colors`}
        >
          Skip tour
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous */}
          {hasPrev && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={onPrev}
              aria-label="Previous step"
              className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${theme.prevBtn}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}

          {/* Next / Finish / Waiting */}
          {step.action === "next" ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
              className={`h-8 px-3.5 sm:px-4 rounded-xl text-[11px] sm:text-[12px] font-bold flex items-center gap-1.5 shadow-lg transition-all ${theme.nextBtn}`}
            >
              {isLast ? (
                <>
                  <PartyPopper className="w-3.5 h-3.5" />
                  <span>Finish</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          ) : (
            <div className={`h-8 px-3 rounded-xl flex items-center gap-1.5 border ${theme.accentLight} ${theme.accentBorder}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} animate-ping`} />
              <span className={`text-[10px] sm:text-[11px] font-semibold ${theme.accent}`}>Waiting…</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile safe area spacer */}
      {isMobile && <div className="h-[env(safe-area-inset-bottom,0px)]" />}
    </motion.div>
  );
}
