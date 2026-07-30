"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-xs font-mono font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all cursor-pointer [color-scheme:dark]"
      />
      <CalendarIcon className="w-3.5 h-3.5 text-neutral-400 absolute right-3 pointer-events-none" />
    </div>
  );
}
