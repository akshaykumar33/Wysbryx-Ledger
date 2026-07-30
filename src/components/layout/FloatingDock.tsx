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
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useAppStore } from "@/lib/store";

export function FloatingDock() {
  const pathname = usePathname();
  const { setCmdOpen } = useAppStore();

  const dockItems = [
    { href: "/dashboard", label: "Executive Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { href: "/engineers", label: "Engineers Roster", icon: <Users className="w-4 h-4" /> },
    { href: "/evaluations", label: "Evaluations Workspace", icon: <ClipboardCheck className="w-4 h-4" /> },
    { href: "/analytics", label: "Skill Gap Analytics", icon: <Layers className="w-4 h-4" /> },
    { href: "/audit-logs", label: "System Audit Logs", icon: <Activity className="w-4 h-4" /> },
    { href: "/docs", label: "Platform Docs", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/settings", label: "Engine Configuration", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 print:hidden">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center gap-1.5 p-2 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/85 backdrop-blur-2xl shadow-2xl shadow-primary/10 ring-1 ring-black/5 dark:ring-white/10"
      >
        {/* Dock Items */}
        {dockItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Tooltip key={item.href} content={item.label}>
              <Link
                href={item.href}
                className={`relative p-2.5 rounded-xl transition-all flex items-center justify-center group ${
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
        <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

        {/* Global Search Trigger */}
        <Tooltip content="Quick Command Palette (Cmd+K)">
          <button
            onClick={() => setCmdOpen(true)}
            className="p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all"
          >
            <Search className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Dynamic Brand Accent Action Button */}
        <Tooltip content="Launch New Evaluation">
          <Link
            href="/evaluations/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg shadow-primary/25 hover:opacity-95 transition-transform hover:scale-105"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Evaluate</span>
          </Link>
        </Tooltip>
      </motion.div>
    </div>
  );
}
