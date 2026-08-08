"use client";

import React, { useEffect, useState } from "react";
import { ElementRect, TourWorldTheme } from "@/lib/tour/types";
import { motion } from "framer-motion";

interface TourOverlayProps {
  targetRect: ElementRect | null;
  world?: TourWorldTheme;
  padding?: number;
}

export function TourOverlay({ targetRect, world = "global", padding = 6 }: TourOverlayProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // No target → no overlay at all (no blur, no dim)
  if (!targetRect || windowSize.width === 0) return null;

  const x = Math.max(0, targetRect.left - padding);
  const y = Math.max(0, targetRect.top - padding);
  const w = Math.min(windowSize.width, targetRect.width + padding * 2);
  const h = Math.min(windowSize.height, targetRect.height + padding * 2);
  const r = 14;

  const isW1 = world === "world1";
  const isW2 = world === "world2";
  const ringColor = isW1 ? "ring-amber-500/60" : isW2 ? "ring-purple-500/60" : "ring-cyan-500/60";

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Soft dim with SVG cutout */}
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.4)" mask="url(#tour-mask)" />
      </svg>

      {/* Minimal ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: "absolute", top: y, left: x, width: w, height: h, borderRadius: `${r}px` }}
        className={`ring-2 ${ringColor} transition-all duration-300`}
      />
    </div>
  );
}
