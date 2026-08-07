"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Lock,
  Bot,
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function CompleteEvalLandingPage() {
  const faqs = [
    {
      q: "Is this platform intended for tracking daily keystrokes or activity?",
      a: "No. Ledger Intel is strictly built against employee surveillance. It is designed for executive leadership to conduct periodic, objective, transparent performance evaluations based on measurable deliverables, technical quality, and peer collaboration.",
    },
    {
      q: "How are the overall scores and grades calculated?",
      a: "Each parameter carries an explicit percentage weight (e.g. 15% for Engineering Knowledge). Scores are calculated via a weighted sum: Score = ∑ ((Rating / 5) * Weight * 100). Grades range from Outstanding (95+) down to Critical (<55).",
    },
    {
      q: "Who can initiate and view evaluations?",
      a: "Only Executive Admins can create and edit evaluations for centralized accountability. Engineers have transparent access to view their own score radar charts, strengths, and improvement suggestions.",
    },
    {
      q: "How does the AI Usage parameter work?",
      a: "It evaluates responsible AI adoption: prompt engineering efficiency, output verification, security awareness (no secrets in prompts), and maintaining original architectural thinking.",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10 transition-all duration-500" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary backdrop-blur-md text-xs font-mono font-semibold shadow-xs mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>NON-SURVEILLANCE • DATA-DRIVEN • TRANSPARENT</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.1]"
        >
          Engineering Performance <br />
          <span className="gradient-brand-text">
            Intelligence Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-xl sm:text-2xl font-mono text-neutral-800 dark:text-neutral-200 font-semibold tracking-tight"
        >
          Measure. Evaluate. Improve. Grow.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-sans"
        >
          An executive-grade evaluation framework designed for leadership to measure talent fairly, eliminate bias, celebrate top performers, and build clear growth roadmaps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/evaluations/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20 group"
          >
            <span>Start Evaluation</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md text-neutral-800 dark:text-neutral-200 font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>View Dashboard</span>
          </Link>
          <Link
            href="/ai-eval"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold text-sm hover:bg-cyan-500/20 transition-all font-mono shadow-lg shadow-cyan-500/10"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Switch to World 1</span>
          </Link>
        </motion.div>

        {/* Hero Interactive Metric Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl shadow-2xl text-left"
        >
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
            <div className="text-[11px] font-mono text-neutral-400 font-semibold uppercase">TOTAL EVALUATIONS</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">128 Completed</div>
            <div className="text-[11px] text-primary font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% vs Q2
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
            <div className="text-[11px] font-mono text-neutral-400 font-semibold uppercase">ORG AVERAGE SCORE</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">87.4 / 100</div>
            <div className="text-[11px] text-primary font-mono font-bold">Grade: Very Good (B+)</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
            <div className="text-[11px] font-mono text-neutral-400 font-semibold uppercase">STANDARDIZED METRICS</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">8 Parameters</div>
            <div className="text-[11px] text-primary font-mono font-bold">Weighted Math</div>
          </div>
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
            <div className="text-[11px] font-mono text-neutral-400 font-semibold uppercase">BIAS PREVENTION</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">100% Evidence</div>
            <div className="text-[11px] text-primary font-mono font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Mandatory proof
            </div>
          </div>
        </motion.div>
      </section>

      {/* METHODOLOGY TABS PREVIEW */}
      <section className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/40 dark:bg-neutral-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
              Evaluation Methodology Principles
            </h2>
          </div>

          <Tabs defaultValue="purpose" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="purpose">Core Purpose</TabsTrigger>
                <TabsTrigger value="evidence">Evidence Based</TabsTrigger>
                <TabsTrigger value="growth">Continuous Growth</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="purpose" className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Fair & Transparent Governance</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Ledger Intel eliminates recency bias and subjective scoring by enforcing explicit percentage weights across technical mastery, responsible AI adoption, system architecture, and team mentorship.
              </p>
            </TabsContent>

            <TabsContent value="evidence" className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Mandatory Artifact & PR Links</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                No score rating can be submitted without attached pull request links, spec document URLs, or verified benchmark outputs. No arbitrary scoring allowed.
              </p>
            </TabsContent>

            <TabsContent value="growth" className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Personalized Skill Gap Roadmaps</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                The platform automatically extracts top strengths and identifies primary skill gaps, generating actionable growth recommendations for every quarter.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* RADIX UI ACCORDION FAQS SECTION */}
      <section className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
              Platform & Evaluation Guidelines
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
