"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";

export function ThemeAccentProvider({ children }: { children: React.ReactNode }) {
  const { themeAccent } = useAppStore();

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme-accent", themeAccent || "wysbryx");
  }, [themeAccent]);

  return <>{children}</>;
}
