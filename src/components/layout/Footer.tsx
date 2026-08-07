"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { WysbryxLogo } from "@/components/ui/WysbryxLogo";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide legacy footer on Root landing and World 1 (AI Evaluation) routes for clean isolation
  if (pathname === "/" || pathname?.startsWith("/ai-eval")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/60 py-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/">
              <WysbryxLogo height={36} />
            </Link>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Transparent, data-driven engineering evaluation platform for continuous talent growth, technical excellence, and fair governance.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/engineers" className="hover:text-primary transition-colors">
                  Engineers Directory
                </Link>
              </li>
              <li>
                <Link href="/evaluations/new" className="hover:text-primary transition-colors">
                  Start New Evaluation
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-primary transition-colors">
                  Analytics & Skill Gaps
                </Link>
              </li>
              <li>
                <Link href="/audit-logs" className="hover:text-primary transition-colors">
                  System Audit Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/docs#why-exists" className="hover:text-primary transition-colors">
                  Evaluation Philosophy
                </Link>
              </li>
              <li>
                <Link href="/docs#scoring-math" className="hover:text-primary transition-colors">
                  Scoring & Weighting Math
                </Link>
              </li>
              <li>
                <Link href="/docs#bias-prevention" className="hover:text-primary transition-colors">
                  Bias Prevention Guide
                </Link>
              </li>
              <li>
                <Link href="/docs#target-audience" className="hover:text-primary transition-colors">
                  Governance & Privileges
                </Link>
              </li>
            </ul>
          </div>

          {/* Principles Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Principles
            </h4>
            <div className="p-4 rounded-2xl border border-primary/30 bg-primary/10 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Shield className="w-4 h-4" />
                <span>Zero Surveillance Policy</span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Built strictly for developer growth, identifying skill gaps, and transparently recognizing technical impact—never keystroke monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <p className="font-mono text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} Wysbryx Technologies. Built for engineering excellence.
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-500">
            <span>WCAG 2.1 AAA Compliant</span>
            <span>•</span>
            <span>SQLite + Drizzle ORM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
