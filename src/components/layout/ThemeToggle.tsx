"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Palette, Check } from "lucide-react";
import { useAppStore, ThemeAccent } from "@/lib/store";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { themeAccent, setThemeAccent } = useAppStore();
  const [mounted, setMounted] = React.useState(false);
  const [showAccentMenu, setShowAccentMenu] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute("data-theme-accent", themeAccent);
  }, [themeAccent]);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900" />;
  }

  const accents: { id: ThemeAccent; label: string; bg: string }[] = [
    { id: "wysbryx", label: "Wysbryx Orange", bg: "bg-[#D8561B]" },
    { id: "violet", label: "Linear Violet", bg: "bg-purple-500" },
    { id: "emerald", label: "Raycast Emerald", bg: "bg-emerald-500" },
    { id: "cyan", label: "Vercel Cyan", bg: "bg-cyan-500" },
    { id: "rose", label: "Neon Rose", bg: "bg-rose-500" },
  ];

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Accent Theme Switcher Button */}
      <button
        onClick={() => setShowAccentMenu(!showAccentMenu)}
        className="p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all shadow-xs"
        title="Change Brand Theme Accent"
      >
        <Palette className="w-3.5 h-3.5" />
      </button>

      {/* Light / Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all shadow-xs"
        title="Toggle Light / Dark Mode"
      >
        {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-700" />}
      </button>

      {/* Accent Popover Dropdown */}
      {showAccentMenu && (
        <div className="absolute top-11 right-0 z-50 w-44 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl shadow-2xl space-y-0.5 animate-slide-in">
          <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase text-neutral-400">
            Brand Accent Theme
          </div>
          {accents.map((acc) => (
            <button
              key={acc.id}
              onClick={() => {
                setThemeAccent(acc.id);
                document.documentElement.setAttribute("data-theme-accent", acc.id);
                setShowAccentMenu(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                themeAccent === acc.id
                  ? "bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${acc.bg}`} />
                <span>{acc.label}</span>
              </div>
              {themeAccent === acc.id && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
