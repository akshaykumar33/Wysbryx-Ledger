"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAIEvalStore } from "@/lib/ai-eval/store";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

type Score = { key: string; rating: number; evidence: string; strength: string; next: string };
type Person = {
  id: string;
  name: string;
  email: string;
  evaluation: null | {
    percentage: number;
    grade: string;
    status: string;
    summary: string;
    evaluator: string;
    updatedAt: string;
    scores: Score[];
  };
};

// Plain-English names for the six skill areas.
const SKILLS: { key: string; label: string; about: string }[] = [
  { key: "q_ai_prompting", label: "Asking AI the right way", about: "Gives AI clear goals and context so answers are usable." },
  { key: "q_ai_codegen", label: "Checking AI-written code", about: "Reads and tests what AI writes before it ships." },
  { key: "q_ai_debug", label: "Fixing bugs with AI", about: "Uses AI to find the cause of problems quickly." },
  { key: "q_ai_workflow", label: "Speed and daily use", about: "Makes AI part of everyday work to deliver faster." },
  { key: "q_ai_systems", label: "Building AI features", about: "Can build product features that use AI." },
  { key: "q_ai_security", label: "Using AI safely", about: "Keeps passwords, keys and customer data out of AI tools." },
];

// Grade names stored in the database, translated for a non-technical reader.
function levelOf(pct: number) {
  if (pct >= 85) return { label: "Expert", color: "#15803d" };
  if (pct >= 70) return { label: "Strong", color: "#2563eb" };
  if (pct >= 50) return { label: "Developing", color: "#ca8a04" };
  if (pct >= 35) return { label: "Beginner", color: "#ea580c" };
  return { label: "Not using AI yet", color: "#dc2626" };
}
const LEVELS = ["Expert", "Strong", "Developing", "Beginner", "Not using AI yet"];

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Bar({ value, max = 100, color = "#111827" }: { value: number; max?: number; color?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: color }} />
    </div>
  );
}

export default function TeamReportPage() {
  const { evaluatorName, isAdmin } = useAIEvalStore();
  const [data, setData] = useState<{ generatedAt: string; people: Person[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin || !evaluatorName) return;
    fetch(`/api/ai-eval/report?evaluatorName=${encodeURIComponent(evaluatorName)}`, { cache: "no-store" })
      .then(async (r) => (r.ok ? r.json() : Promise.reject((await r.json()).error)))
      .then(setData)
      .catch((e) => setError(String(e || "Could not load the report.")));
  }, [isAdmin, evaluatorName]);

  const stats = useMemo(() => {
    if (!data) return null;
    const reviewed = data.people.filter((p) => p.evaluation && p.evaluation.percentage > 0);
    const pending = data.people.filter((p) => !p.evaluation || !(p.evaluation.percentage > 0));
    const ranked = [...reviewed].sort((a, b) => b.evaluation!.percentage - a.evaluation!.percentage);
    const levelCounts = LEVELS.map((l) => ({ label: l, count: reviewed.filter((p) => levelOf(p.evaluation!.percentage).label === l).length }));
    const skillAvgs = SKILLS.map((s) => ({
      ...s,
      avg: avg(reviewed.flatMap((p) => p.evaluation!.scores.filter((x) => x.key === s.key).map((x) => x.rating))),
    }));
    const bySkill = [...skillAvgs].sort((a, b) => b.avg - a.avg);
    return {
      reviewed,
      pending,
      ranked,
      levelCounts,
      skillAvgs,
      strongest: bySkill[0],
      weakest: bySkill.slice(-2).reverse(),
      teamAvg: Math.round(avg(reviewed.map((p) => p.evaluation!.percentage))),
      readyToLead: ranked.filter((p) => p.evaluation!.percentage >= 85),
      needSupport: ranked.filter((p) => p.evaluation!.percentage < 50).reverse(),
    };
  }, [data]);

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center text-neutral-300">
        The team report is only available to admins. Sign in as an admin on the <Link href="/ai-eval" className="underline">AI evaluation page</Link>.
      </div>
    );
  }
  if (error) return <div className="max-w-xl mx-auto p-10 text-center text-red-400">{error}</div>;
  if (!data || !stats) {
    return (
      <div className="flex items-center justify-center gap-2 p-16 text-neutral-400">
        <Loader2 className="w-4 h-4 animate-spin" /> Putting the report together…
      </div>
    );
  }

  const total = data.people.length;

  return (
    <div className="report-root bg-neutral-100 min-h-screen py-6 sm:py-10 px-4">
      <style>{`
        @page { size: A4; margin: 14mm; }
        .sheet h1, .sheet h2, .sheet h3 { color: #111827; }
        @media print {
          :root { color-scheme: light !important; }
          header, .no-print { display: none !important; }
          html, body, *:has(> .report-root), *:has(.report-root), .report-root {
            background: #fff !important; padding: 0 !important; margin: 0 !important; min-height: 0 !important;
          }
          .sheet { box-shadow: none !important; margin: 0 !important; max-width: none !important; padding: 0 !important; border-radius: 0 !important; }
          .page-break { break-before: page; }
          .avoid-break { break-inside: avoid; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print max-w-[860px] mx-auto mb-4 flex items-center justify-between gap-3">
        <Link href="/ai-eval" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>
      <p className="no-print max-w-[860px] mx-auto mb-4 text-xs text-neutral-500">
        In the print window, choose “Save as PDF”. Turn on “Background graphics” to keep the colours.
      </p>

      <article className="sheet max-w-[860px] mx-auto bg-white text-neutral-900 rounded-xl shadow-sm p-6 sm:p-12 font-sans leading-relaxed">
        {/* Cover */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Wysbryx · Confidential</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">How our team uses AI</h1>
          <p className="mt-2 text-lg text-neutral-600">Engineering team review for leadership</p>
          <p className="mt-1 text-sm text-neutral-500">Prepared on {fmtDate(data.generatedAt)}</p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { k: "People reviewed", v: `${stats.reviewed.length} of ${total}` },
              { k: "Team average", v: `${stats.teamAvg}%` },
              { k: "Ready to lead others", v: String(stats.readyToLead.length) },
              { k: "Need support", v: String(stats.needSupport.length) },
            ].map((t) => (
              <div key={t.k} className="rounded-lg border border-neutral-200 p-4 avoid-break">
                <div className="text-2xl font-bold tabular-nums">{t.v}</div>
                <div className="text-xs text-neutral-500 mt-1">{t.k}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="mt-10 avoid-break">
          <h2 className="text-xl font-bold">In short</h2>
          <ul className="mt-3 space-y-2 text-[15px] text-neutral-700 list-disc pl-5">
            <li>
              The team scores <strong>{stats.teamAvg}%</strong> on average across six everyday AI skills.{" "}
              {stats.teamAvg >= 70 ? "Most people already use AI well in their daily work." : stats.teamAvg >= 50 ? "Most people use AI, but not yet consistently or to its full value." : "AI is not yet a regular part of how most people work."}
            </li>
            <li>
              The team is strongest at <strong>{stats.strongest.label.replace(/^w/, (c) => c.toLowerCase())}</strong> ({stats.strongest.avg.toFixed(1)} out of 10).
            </li>
            <li>
              The biggest gaps are <strong>{stats.weakest[0].label.replace(/^w/, (c) => c.toLowerCase())}</strong> ({stats.weakest[0].avg.toFixed(1)}) and{" "}
              <strong>{stats.weakest[1].label.replace(/^w/, (c) => c.toLowerCase())}</strong> ({stats.weakest[1].avg.toFixed(1)}).
            </li>
            {stats.readyToLead.length > 0 && (
              <li>
                {stats.readyToLead.length === 1 ? "One person is" : `${stats.readyToLead.length} people are`} ready to coach others:{" "}
                {stats.readyToLead.map((p) => p.name).join(", ")}.
              </li>
            )}
            {stats.needSupport.length > 0 && (
              <li>
                {stats.needSupport.length === 1 ? "One person needs" : `${stats.needSupport.length} people need`} hands-on support to get started:{" "}
                {stats.needSupport.map((p) => p.name).join(", ")}.
              </li>
            )}
            {stats.pending.length > 0 && (
              <li>{stats.pending.length} {stats.pending.length === 1 ? "person has" : "people have"} not been reviewed yet and are listed at the end.</li>
            )}
          </ul>
        </section>

        {/* Levels */}
        <section className="mt-10 avoid-break">
          <h2 className="text-xl font-bold">Where people are</h2>
          <p className="text-sm text-neutral-500 mt-1">Expert 85%+ · Strong 70–84% · Developing 50–69% · Beginner 35–49% · Not using AI yet below 35%</p>
          <div className="mt-4 space-y-2.5">
            {stats.levelCounts.map((l) => (
              <div key={l.label} className="grid grid-cols-[150px_1fr_40px] items-center gap-3 text-sm">
                <span>{l.label}</span>
                <Bar value={l.count} max={Math.max(1, stats.reviewed.length)} color={levelOf([90, 75, 60, 40, 10][LEVELS.indexOf(l.label)]).color} />
                <span className="text-right tabular-nums font-semibold">{l.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10 avoid-break">
          <h2 className="text-xl font-bold">Team average by skill</h2>
          <div className="mt-4 space-y-4">
            {stats.skillAvgs.map((s) => (
              <div key={s.key}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{s.label}</span>
                  <span className="tabular-nums font-semibold">{s.avg.toFixed(1)} / 10</span>
                </div>
                <p className="text-xs text-neutral-500 mb-1.5">{s.about}</p>
                <Bar value={s.avg} max={10} color={levelOf(s.avg * 10).color} />
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-10 avoid-break">
          <h2 className="text-xl font-bold">What we suggest</h2>
          <ol className="mt-3 space-y-2 text-[15px] text-neutral-700 list-decimal pl-5">
            <li>Run a short, practical session on <strong>{stats.weakest[0].label.replace(/^w/, (c) => c.toLowerCase())}</strong>, the team’s weakest area.</li>
            {stats.readyToLead.length > 0 && <li>Pair each person who needs support with one of the team’s experts for two weeks.</li>}
            <li>Agree a simple team rule: no passwords, keys or customer data in AI tools.</li>
            <li>Review everyone again in three months to measure progress.</li>
          </ol>
        </section>

        {/* Ranking table */}
        <section className="page-break mt-10">
          <h2 className="text-xl font-bold">Everyone at a glance</h2>
          <table className="mt-4 w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-neutral-300">
                <th className="py-2 pr-2 font-medium w-8">#</th>
                <th className="py-2 pr-2 font-medium">Name</th>
                <th className="py-2 pr-2 font-medium">Level</th>
                <th className="py-2 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.ranked.map((p, i) => {
                const lv = levelOf(p.evaluation!.percentage);
                return (
                  <tr key={p.id} className="border-b border-neutral-100 avoid-break">
                    <td className="py-1.5 pr-2 text-neutral-400 tabular-nums">{i + 1}</td>
                    <td className="py-1.5 pr-2">{p.name}</td>
                    <td className="py-1.5 pr-2" style={{ color: lv.color }}>{lv.label}</td>
                    <td className="py-1.5 text-right tabular-nums font-semibold">{Math.round(p.evaluation!.percentage)}%</td>
                  </tr>
                );
              })}
              {stats.pending.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 text-neutral-400">
                  <td className="py-1.5 pr-2">–</td>
                  <td className="py-1.5 pr-2">{p.name}</td>
                  <td className="py-1.5 pr-2">Not reviewed yet</td>
                  <td className="py-1.5 text-right">–</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Per person */}
        <section className="page-break mt-10">
          <h2 className="text-xl font-bold">Individual notes</h2>
          <div className="mt-4 space-y-8">
            {stats.ranked.map((p) => {
              const ev = p.evaluation!;
              const lv = levelOf(ev.percentage);
              const byKey = new Map(ev.scores.map((s) => [s.key, s]));
              // First best / first weakest in skill order, matching how summaries are written.
              const ordered = SKILLS.map((s) => byKey.get(s.key)).filter((s): s is Score => !!s);
              const top = ordered.reduce<Score | undefined>((m, s) => (!m || s.rating > m.rating ? s : m), undefined);
              const low = ordered.reduce<Score | undefined>((m, s) => (!m || s.rating < m.rating ? s : m), undefined);
              return (
                <div key={p.id} className="avoid-break border-t border-neutral-200 pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <p className="text-xs text-neutral-500">
                        Reviewed by {ev.evaluator || "the review team"} · {fmtDate(ev.updatedAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold tabular-nums">{Math.round(ev.percentage)}%</div>
                      <div className="text-xs font-semibold" style={{ color: lv.color }}>{lv.label}</div>
                    </div>
                  </div>
                  {ev.summary && <p className="mt-3 text-[15px] text-neutral-700">{ev.summary}</p>}
                  <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {SKILLS.map((s) => {
                      const r = byKey.get(s.key)?.rating ?? 0;
                      return (
                        <div key={s.key} className="text-sm">
                          <div className="flex justify-between"><span>{s.label}</span><span className="tabular-nums">{r}/10</span></div>
                          <Bar value={r} max={10} color={levelOf(r * 10).color} />
                        </div>
                      );
                    })}
                  </div>
                  {top && low && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg bg-green-50 p-3">
                        <div className="font-semibold text-green-800">Doing well</div>
                        <p className="text-neutral-700 mt-0.5">{top.strength || top.evidence}</p>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-3">
                        <div className="font-semibold text-amber-800">Next step</div>
                        <p className="text-neutral-700 mt-0.5">{low.next || low.evidence}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 pt-4 border-t border-neutral-200 text-xs text-neutral-400">
          Scores come from evaluator reviews across six skill areas, each rated out of 10. Generated from live data on {fmtDate(data.generatedAt)}.
        </footer>
      </article>
    </div>
  );
}
