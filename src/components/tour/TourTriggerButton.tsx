"use client";

import React from "react";
import { useTourStore } from "@/lib/tour/store";
import { Compass, HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface TourTriggerButtonProps {
  variant?: "icon" | "full" | "menu";
  className?: string;
}

export function TourTriggerButton({
  variant = "icon",
  className = "",
}: TourTriggerButtonProps) {
  const { restartTour } = useTourStore();

  if (variant === "full") {
    return (
      <button
        onClick={restartTour}
        data-tour="tour-restart-btn"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-amber-500/30 text-xs font-mono font-bold transition-all shadow-xs ${className}`}
        title="Start Interactive Guided Tour"
      >
        <Compass className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Guided Tour</span>
      </button>
    );
  }

  if (variant === "menu") {
    return (
      <button
        onClick={restartTour}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors ${className}`}
      >
        <Compass className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Start Guided Tour</span>
      </button>
    );
  }

  return (
    <Tooltip content="Start Interactive Guided Tour">
      <button
        onClick={restartTour}
        data-tour="tour-restart-btn"
        aria-label="Start Guided Tour"
        className={`p-2 rounded-xl text-amber-500 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-500/10 transition-colors ${className}`}
      >
        <Compass className="w-4 h-4" />
      </button>
    </Tooltip>
  );
}
