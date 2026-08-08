"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  ClipboardCheck,
  Layers,
  Activity,
  BookOpen,
  Settings,
  PlusCircle,
  Search,
  Bot,
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useAppStore } from "@/lib/store";

import { TourTriggerButton } from "@/components/tour/TourTriggerButton";

export function FloatingDock() {
  const pathname = usePathname();
  const { setCmdOpen } = useAppStore();

  // Hide FloatingDock on root portal landing page and World 1 (AI Evaluation) routes
  if (pathname === "/" || pathname?.startsWith("/ai-eval")) {
    return null;
  }

  const dockItems = [
    { href: "/dashboard", label: "Executive Dashboard", icon: <BarChart3 className="w-4 h-4" />, mobile: true },
    { href: "/engineers", label: "Engineers Roster", icon: <Users className="w-4 h-4" />, mobile: true },
    { href: "/evaluations", label: "Evaluations Workspace", icon: <ClipboardCheck className="w-4 h-4" />, mobile: true },
    { href: "/analytics", label: "Skill Gap Analytics", icon: <Layers className="w-4 h-4" />, mobile: false },
    { href: "/audit-logs", label: "System Audit Logs", icon: <Activity className="w-4 h-4" />, mobile: false },
    { href: "/docs", label: "Platform Docs", icon: <BookOpen className="w-4 h-4" />, mobile: true },
    { href: "/settings", label: "Engine Configuration", icon: <Settings className="w-4 h-4" />, mobile: false },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 print:hidden max-w-[95vw]">
      <motion.div
        data-tour="floating-dock"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/85 backdrop-blur-2xl shadow-2xl shadow-primary/10 ring-1 ring-black/5 dark:ring-white/10 overflow-x-auto scrollbar-none max-w-full"
      >
        {/* Dock Items */}
        {dockItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Tooltip key={item.href} content={item.label}>
              <Link
                href={item.href}
                className={`relative p-2 sm:p-2.5 rounded-xl transition-all flex items-center justify-center group shrink-0 ${
                  !item.mobile ? "hidden sm:flex" : "flex"
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                }`}
              >
                {item.icon}
                {isActive && (
                  <motion.span
                    layoutId="activeDockDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            </Tooltip>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-5 sm:h-6 bg-neutral-200 dark:bg-neutral-800 mx-0.5 sm:mx-1 shrink-0" />

        {/* Global Search Trigger */}
        <Tooltip content="Quick Command Palette (Cmd+K)">
          <button
            onClick={() => setCmdOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Guided Tour Trigger */}
        <TourTriggerButton variant="icon" />

        {/* Switch to World 1 Button */}
        <Tooltip content="Switch to World 1 (AI Evaluation Engine)">
          <Link
            href="/ai-eval"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 font-mono font-bold text-xs shadow-xs transition-transform hover:scale-105 shrink-0"
          >
            <Bot className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="hidden lg:inline">World 1</span>
          </Link>
        </Tooltip>

        {/* Dynamic Brand Accent Action Button */}
        <Tooltip content="Launch New Evaluation">
          <Link
            href="/evaluations/new"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg shadow-primary/25 hover:opacity-95 transition-transform hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Evaluate</span>
          </Link>
        </Tooltip>
      </motion.div>
    </div>
  );
}
