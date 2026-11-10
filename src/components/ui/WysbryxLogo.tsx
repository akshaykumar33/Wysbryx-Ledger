"use client";

import * as React from "react";

interface WysbryxLogoProps {
  className?: string;
  height?: number;
}

// The mark ships with the app (public/wysbryx-mark.png) so the logo never
// depends on an external URL; the wordmark is text so it follows the theme.
export function WysbryxLogo({ className = "", height = 36 }: WysbryxLogoProps) {
  const mark = Math.round(height * 0.8);
  return (
    <div className={`flex items-center gap-2 group select-none ${className}`}>
      <img
        src="/wysbryx-mark.png"
        alt=""
        width={mark}
        height={mark}
        className="shrink-0 group-hover:scale-105 transition-transform duration-300"
      />
      <span
        className="font-display font-bold tracking-tight text-neutral-900 dark:text-white"
        style={{ fontSize: `${Math.round(height * 0.5)}px`, lineHeight: 1 }}
      >
        Wysbryx
      </span>
      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
        INTEL
      </span>
    </div>
  );
}
