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
type Reviewed = Person & { evaluation: NonNullable<Person["evaluation"]> };

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
const LEVELS = [
  { label: "Expert", min: 85, color: "#047857", tint: "#ECFDF5" },
  { label: "Strong", min: 70, color: "#2563EB", tint: "#EFF6FF" },
  { label: "Developing", min: 50, color: "#CA8A04", tint: "#FEFCE8" },
  { label: "Beginner", min: 35, color: "#EA580C", tint: "#FFF7ED" },
  { label: "Not using AI yet", min: 0, color: "#DC2626", tint: "#FEF2F2" },
];
const levelOf = (pct: number) => LEVELS.find((l) => pct >= l.min) ?? LEVELS[LEVELS.length - 1];

const ACCENT = "#C2410C"; // Wysbryx orange, darkened for text contrast
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const lowerFirst = (s: string) => s.replace(/^\w/, (c) => c.toLowerCase());

function Ring({ value, size = 120, stroke = 10, color = ACCENT, label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${Math.round(value)}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E7E5E4" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(Math.max(0, Math.min(100, value)) / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.26} fontWeight={700} fill="#1C1917" style={{ fontFeatureSettings: '"tnum"' }}>
        {Math.round(value)}
        <tspan fontSize={size * 0.13} fontWeight={600} fill="#78716C">%</tspan>
      </text>
    </svg>
  );
}

function Meter({ value, max = 10, color, marker }: { value: number; max?: number; color: string; marker?: number }) {
  return (
    <div className="relative h-1.5 w-full rounded-full bg-stone-200">
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: color }} />
      {marker !== undefined && (
        <div className="absolute -top-1 h-3.5 w-0.5 rounded bg-stone-900" style={{ left: `calc(${(marker / max) * 100}% - 1px)` }} title="Team average" />
      )}
    </div>
  );
}

function SectionTitle({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>{kicker}</p>
      <h2 className="mt-1 text-[25px] font-semibold leading-tight tracking-[-0.01em] text-stone-900">{title}</h2>
      {intro && <p className="mt-2 max-w-[65ch] text-[14px] leading-relaxed text-stone-600">{intro}</p>}
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
    const reviewed = data.people.filter((p): p is Reviewed => !!p.evaluation && p.evaluation.percentage > 0);
    const pending = data.people.filter((p) => !p.evaluation || !(p.evaluation.percentage > 0));
    const ranked = [...reviewed].sort((a, b) => b.evaluation.percentage - a.evaluation.percentage);
    const levelCounts = LEVELS.map((l) => ({ ...l, count: reviewed.filter((p) => levelOf(p.evaluation.percentage).label === l.label).length }));
    const skillAvgs = SKILLS.map((s) => ({
      ...s,
      avg: avg(reviewed.flatMap((p) => p.evaluation.scores.filter((x) => x.key === s.key).map((x) => x.rating))),
    }));
    const bySkill = [...skillAvgs].sort((a, b) => b.avg - a.avg);
    return {
      reviewed,
      pending,
      ranked,
      levelCounts,
      skillAvgs,
      skillAvgByKey: new Map(skillAvgs.map((s) => [s.key, s.avg])),
      strongest: bySkill[0],
      weakest: bySkill.slice(-2).reverse(),
      teamAvg: avg(reviewed.map((p) => p.evaluation.percentage)),
      readyToLead: ranked.filter((p) => p.evaluation.percentage >= 85),
      needSupport: ranked.filter((p) => p.evaluation.percentage < 50).reverse(),
      strongOrBetter: reviewed.filter((p) => p.evaluation.percentage >= 70).length,
    };
  }, [data]);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl p-10 text-center text-neutral-600 dark:text-neutral-300">
        The team report is only available to admins. Sign in as an admin on the{" "}
        <Link href="/ai-eval" className="underline underline-offset-2">AI evaluation page</Link>.
      </div>
    );
  }
  if (error) return <div className="mx-auto max-w-xl p-10 text-center text-red-700 dark:text-red-400">{error}</div>;
  if (!data || !stats) {
    return (
      <div className="flex items-center justify-center gap-2 p-16 text-neutral-500 dark:text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Putting the report together…
      </div>
    );
  }

  const total = data.people.length;
  const date = fmtDate(data.generatedAt);
  const teamLevel = levelOf(stats.teamAvg);
  const verdict =
    stats.teamAvg >= 70
      ? "Most of the team already uses AI well in daily work."
      : stats.teamAvg >= 50
        ? "Most people use AI, but not yet consistently or to its full value."
        : "AI is not yet a regular part of how most people work.";

  return (
    <div className="report-root min-h-screen bg-neutral-100 px-4 py-6 dark:bg-neutral-950 sm:py-10">
      <style>{`
        .sheet { font-feature-settings: "tnum" 1, "cv11" 1; }
        .sheet h1, .sheet h2, .sheet h3 { color: #1C1917 !important; }
        @page { size: A4; margin: 16mm 16mm 18mm; }
        @page {
          @bottom-left { content: "Wysbryx · AI Skills Review · Confidential"; font: 500 8pt system-ui, sans-serif; color: #A8A29E; }
          @bottom-right { content: counter(page) " / " counter(pages); font: 500 8pt system-ui, sans-serif; color: #A8A29E; }
        }
        @media print {
          :root { color-scheme: light !important; }
          header, nav, footer.site-footer, .no-print { display: none !important; }
          html, body, *:has(.report-root), .report-root {
            background: #fff !important; padding: 0 !important; margin: 0 !important; min-height: 0 !important;
          }
          .sheet { box-shadow: none !important; border: 0 !important; margin: 0 !important; max-width: none !important; padding: 0 !important; border-radius: 0 !important; }
          .page { break-after: page; padding: 0 !important; border: 0 !important; }
          .page:last-child { break-after: auto; }
          .page-start { break-before: page; padding: 0 !important; border: 0 !important; }
          .rank { break-before: avoid; padding: 32px 0 0 !important; border: 0 !important; margin: 0 !important; }
          .avoid-break { break-inside: avoid; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print mx-auto mb-5 flex max-w-[880px] flex-wrap items-center justify-between gap-3">
        <Link
          href="/ai-eval"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to evaluations
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:inline">Choose “Save as PDF” in the print window</span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 active:bg-orange-900"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <article className="sheet mx-auto max-w-[880px] overflow-hidden rounded-2xl bg-white font-sans text-stone-900 shadow-[0_1px_2px_rgba(28,25,23,.06),0_8px_24px_rgba(28,25,23,.08)] ring-1 ring-stone-200 dark:ring-0">
        {/* ── Page 1: cover & summary ───────────────────────── */}
        <section className="page px-8 py-10 sm:px-14 sm:py-14">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: ACCENT }} />
              <span className="text-[13px] font-semibold tracking-tight">Wysbryx</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Confidential · {date}</span>
          </div>

          <div className="mt-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>Engineering team review</p>
            <h1 className="mt-2 text-[39px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 sm:text-[48px]">How our team uses AI</h1>
            <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-stone-600">
              A review of {total} engineers across six everyday AI skills, prepared for leadership.
            </p>
          </div>

          <div className="mt-10 grid items-center gap-8 rounded-2xl bg-stone-50 p-6 ring-1 ring-stone-200 sm:grid-cols-[auto_1fr] sm:p-8">
            <Ring value={stats.teamAvg} size={136} stroke={12} color={teamLevel.color} label={`Team average ${Math.round(stats.teamAvg)} percent`} />
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-stone-500">Team average</p>
              <p className="mt-1 text-[25px] font-semibold leading-tight tracking-[-0.01em]">
                {teamLevel.label} <span className="text-stone-400">overall</span>
              </p>
              <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-stone-600">{verdict}</p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-stone-200 ring-1 ring-stone-200 sm:grid-cols-4">
            {[
              { k: "People reviewed", v: `${stats.reviewed.length}`, s: `of ${total}` },
              { k: "Strong or expert", v: `${stats.strongOrBetter}`, s: `${Math.round((stats.strongOrBetter / Math.max(1, stats.reviewed.length)) * 100)}% of team` },
              { k: "Ready to coach", v: `${stats.readyToLead.length}`, s: "Expert level" },
              { k: "Need support", v: `${stats.needSupport.length}`, s: "Below 50%" },
            ].map((t) => (
              <div key={t.k} className="bg-white p-5">
                <dt className="text-[12px] font-medium text-stone-500">{t.k}</dt>
                <dd className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[31px] font-semibold leading-none tracking-[-0.02em]">{t.v}</span>
                  <span className="text-[12px] text-stone-500">{t.s}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12">
            <SectionTitle kicker="Summary" title="What leadership should know" />
            <ol className="space-y-4">
              {[
                <>The team is strongest at <strong className="font-semibold text-stone-900">{lowerFirst(stats.strongest.label)}</strong>, averaging {stats.strongest.avg.toFixed(1)} out of 10.</>,
                <>The biggest gaps are <strong className="font-semibold text-stone-900">{lowerFirst(stats.weakest[0].label)}</strong> ({stats.weakest[0].avg.toFixed(1)}) and <strong className="font-semibold text-stone-900">{lowerFirst(stats.weakest[1].label)}</strong> ({stats.weakest[1].avg.toFixed(1)}).</>,
                stats.readyToLead.length > 0 && (
                  <>{stats.readyToLead.length === 1 ? "One person is" : `${stats.readyToLead.length} people are`} ready to coach others: {stats.readyToLead.map((p) => p.name).join(", ")}.</>
                ),
                stats.needSupport.length > 0 && (
                  <>{stats.needSupport.length === 1 ? "One person needs" : `${stats.needSupport.length} people need`} hands-on support to get started: {stats.needSupport.map((p) => p.name).join(", ")}.</>
                ),
                stats.pending.length > 0 && <>{stats.pending.length} {stats.pending.length === 1 ? "person has" : "people have"} not been reviewed yet.</>,
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <li key={i} className="flex gap-4 text-[15px] leading-relaxed text-stone-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ background: ACCENT }}>{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
            </ol>
          </div>
        </section>

        {/* ── Page 2: the picture ───────────────────────────── */}
        <section className="page-start border-t border-stone-200 px-8 py-10 sm:px-14 sm:py-14">
          <SectionTitle kicker="The picture" title="Where people are today" intro="Each person gets an overall score from their six skill ratings. The bar below shows how the team splits across the five levels." />

          <div className="avoid-break">
            <div className="flex h-10 w-full overflow-hidden rounded-xl ring-1 ring-stone-200" role="img" aria-label="Team split by level">
              {stats.levelCounts.filter((l) => l.count > 0).map((l) => (
                <div
                  key={l.label}
                  className="flex items-center justify-center text-[13px] font-semibold text-white"
                  style={{ width: `${(l.count / Math.max(1, stats.reviewed.length)) * 100}%`, background: l.color }}
                >
                  {l.count}
                </div>
              ))}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {stats.levelCounts.map((l, i) => (
                <li key={l.label} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: l.color }} />
                  <span>
                    <span className="block font-semibold leading-snug text-stone-900">{l.label}</span>
                    <span className="block whitespace-nowrap text-[12px] text-stone-500">
                      {l.count} {l.count === 1 ? "person" : "people"} · {i === 0 ? `${l.min}%+` : l.min === 0 ? `below ${LEVELS[i - 1].min}%` : `${l.min}–${LEVELS[i - 1].min - 1}%`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 avoid-break">
            <SectionTitle kicker="Skills" title="Team average by skill" intro="Out of 10. The longer the bar, the stronger the team is in that area." />
            <div className="divide-y divide-stone-200 rounded-2xl ring-1 ring-stone-200">
              {[...stats.skillAvgs].sort((a, b) => b.avg - a.avg).map((s) => {
                const lv = levelOf(s.avg * 10);
                return (
                  <div key={s.key} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]">
                    <div>
                      <p className="text-[14px] font-semibold text-stone-900">{s.label}</p>
                      <p className="text-[12px] text-stone-500">{s.about}</p>
                    </div>
                    <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                      <Meter value={s.avg} color={lv.color} />
                    </div>
                    <p className="col-start-2 row-start-1 text-right text-[16px] font-semibold sm:col-start-auto sm:row-start-auto">
                      {s.avg.toFixed(1)}<span className="text-[12px] font-medium text-stone-400"> /10</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-14 avoid-break">
            <SectionTitle kicker="Next steps" title="What we recommend" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "Close the biggest gap", d: `Run a short, hands-on session on ${lowerFirst(stats.weakest[0].label)}, the team’s weakest area.` },
                stats.readyToLead.length > 0 && stats.needSupport.length > 0
                  ? { t: "Pair people up", d: "Pair each person who needs support with one of the team’s experts for two weeks." }
                  : { t: "Share what works", d: "Ask the strongest people to share how they use AI in a short team demo." },
                { t: "Agree one safety rule", d: "No passwords, keys or customer data in AI tools, ever. Make it part of code review." },
                { t: "Measure again", d: "Review everyone again in three months to see what has improved." },
              ].map((r, i) => (
                <div key={i} className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200">
                  <p className="text-[12px] font-semibold" style={{ color: ACCENT }}>0{i + 1}</p>
                  <p className="mt-1 text-[15px] font-semibold text-stone-900">{r.t}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-stone-600">{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ranking (flows on from the recommendations) ────── */}
        <section className="rank border-t border-stone-200 px-8 py-10 sm:px-14 sm:py-14">
          <SectionTitle kicker="Everyone" title="The full team, ranked" />
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-stone-300 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                <th className="w-8 py-2 pr-2 font-semibold">#</th>
                <th className="py-2 pr-3 font-semibold">Name</th>
                <th className="py-2 pr-3 font-semibold">Level</th>
                <th className="hidden w-[30%] py-2 pr-3 font-semibold sm:table-cell">Score</th>
                <th className="w-12 py-2 text-right font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.ranked.map((p, i) => {
                const lv = levelOf(p.evaluation.percentage);
                return (
                  <tr key={p.id} className="avoid-break border-b border-stone-100">
                    <td className="py-[5px] pr-2 text-stone-400">{i + 1}</td>
                    <td className="py-[5px] pr-3 font-medium text-stone-900">{p.name}</td>
                    <td className="py-[5px] pr-3">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: lv.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: lv.color }} />
                        {lv.label}
                      </span>
                    </td>
                    <td className="hidden py-[5px] pr-3 sm:table-cell"><Meter value={p.evaluation.percentage} max={100} color={lv.color} /></td>
                    <td className="py-[5px] text-right font-semibold">{Math.round(p.evaluation.percentage)}</td>
                  </tr>
                );
              })}
              {stats.pending.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 text-stone-400">
                  <td className="py-[5px] pr-2">–</td>
                  <td className="py-[5px] pr-3">{p.name}</td>
                  <td className="py-[5px] pr-3 text-[12px]">Not reviewed yet</td>
                  <td className="hidden sm:table-cell" />
                  <td className="py-[5px] text-right">–</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── Profiles ──────────────────────────────────────── */}
        <section className="page page-start border-t border-stone-200 px-8 py-10 sm:px-14 sm:py-14">
          <SectionTitle kicker="Individuals" title="Notes on each person" intro="Ordered by score. The small black line on each bar marks the team average for that skill." />
          <div className="space-y-4">
            {stats.ranked.map((p) => {
              const ev = p.evaluation;
              const lv = levelOf(ev.percentage);
              const byKey = new Map(ev.scores.map((s) => [s.key, s]));
              // First best / first weakest in skill order, matching how summaries are written.
              const ordered = SKILLS.map((s) => byKey.get(s.key)).filter((s): s is Score => !!s);
              const top = ordered.reduce<Score | undefined>((m, s) => (!m || s.rating > m.rating ? s : m), undefined);
              const low = ordered.reduce<Score | undefined>((m, s) => (!m || s.rating < m.rating ? s : m), undefined);
              return (
                <div key={p.id} className="avoid-break rounded-2xl p-5 ring-1 ring-stone-200 sm:p-6">
                  <div className="flex items-start gap-4">
                    <Ring value={ev.percentage} size={56} stroke={5} color={lv.color} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-stone-900">{p.name}</h3>
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: lv.color, background: lv.tint }}>{lv.label}</span>
                      </div>
                      <p className="text-[12px] text-stone-500">Reviewed by {ev.evaluator || "the review team"} · {fmtDate(ev.updatedAt)}</p>
                      {ev.summary && <p className="mt-2 max-w-[75ch] text-[13px] leading-relaxed text-stone-700">{ev.summary}</p>}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                    {SKILLS.map((s) => {
                      const r = byKey.get(s.key)?.rating ?? 0;
                      return (
                        <div key={s.key}>
                          <div className="mb-1 flex justify-between text-[12px]">
                            <span className="truncate text-stone-600">{s.label}</span>
                            <span className="font-semibold text-stone-900">{r}</span>
                          </div>
                          <Meter value={r} color={levelOf(r * 10).color} marker={stats.skillAvgByKey.get(s.key)} />
                        </div>
                      );
                    })}
                  </div>

                  {top && low && (
                    <div className="mt-4 grid gap-3 text-[12px] leading-relaxed sm:grid-cols-2">
                      <p className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-stone-700">
                        <span className="font-semibold text-emerald-800">Doing well · </span>
                        {top.strength || top.evidence}
                      </p>
                      <p className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-stone-700">
                        <span className="font-semibold text-amber-800">Next step · </span>
                        {low.next || low.evidence}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-10 border-t border-stone-200 pt-4 text-[11px] leading-relaxed text-stone-500">
            Scores come from evaluator reviews across six skill areas, each rated out of 10. Generated from live data on {date}.
          </p>
        </section>
      </article>
    </div>
  );
}
