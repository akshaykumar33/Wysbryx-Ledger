"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

// Keeps toast colours in step with the light/dark switch.
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="bottom-right" theme={resolvedTheme === "light" ? "light" : "dark"} richColors closeButton />;
}
