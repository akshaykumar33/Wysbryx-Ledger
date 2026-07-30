"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "indigo" | "purple" | "outline" | "brand";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-primary/10 text-primary border-primary/20 shadow-xs shadow-primary/5",
    brand:
      "bg-primary/10 text-primary border-primary/30 shadow-xs shadow-primary/10",
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs shadow-emerald-500/10",
    warning:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-xs shadow-amber-500/10",
    destructive:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-xs shadow-rose-500/10",
    indigo:
      "bg-primary/10 text-primary border-primary/30 shadow-xs shadow-primary/10",
    purple:
      "bg-primary/10 text-primary border-primary/30 shadow-xs shadow-primary/10",
    outline:
      "bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400",
  };

  const dotColors = {
    default: "bg-primary",
    brand: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-rose-500",
    indigo: "bg-primary",
    purple: "bg-primary",
    outline: "bg-neutral-400",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-semibold rounded-full border transition-all select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      <span>{children}</span>
    </div>
  );
}
