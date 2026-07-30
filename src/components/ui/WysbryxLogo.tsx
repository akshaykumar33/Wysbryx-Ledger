"use client";

import * as React from "react";

interface WysbryxLogoProps {
  className?: string;
  height?: number;
}

export function WysbryxLogo({ className = "", height = 36 }: WysbryxLogoProps) {
  return (
    <div className={`flex items-center gap-2 group select-none ${className}`}>
      <img
        src="https://www.wysbryx.com/wysbryx_v.png"
        alt="Wysbryx Logo"
        style={{ height: `${height}px` }}
        className="w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
      />
      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        INTEL
      </span>
    </div>
  );
}
