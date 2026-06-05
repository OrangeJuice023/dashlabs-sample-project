import type { ProjectMeta } from "@/lib/types";
import type { ProjectDetail } from "@/content/project-details";
import { SyntheticBadge } from "@/components/SyntheticBadge";

/* ------------------------------------------------------------------ */
/*  Inline bar renderer                                                */
/*  Self-contained (no Recharts) so each chart honours its own unit    */
/*  — "%" for rates, " min" for turnaround, "x" for multipliers, etc.  */
/* ------------------------------------------------------------------ */

type Datum = { label: string; value: number; n?: number };

function fmtValue(value: number, unit?: string) {
  const u = unit ?? "";
  // Keep one decimal only when the number actually needs it.
  const num = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return num + u;
}

function InlineBars({ data, unit }: { data: Datum[]; unit?: string }) {
  const maxVal = data.reduce(function pickMax(acc, d) {
    return d.value > acc ? d.value : acc;
  }, 0);
  const safeMax = maxVal > 0 ? maxVal : 1;

  return (
    <div className="flex flex-col gap-3">
      {data.map(function renderRow(d, i) {
        const pct = Math.max(2, (d.value / safeMax) * 100);
        const isTop = d.value === maxVal;
        return (
          <div key={d.label + i} className="grid grid-cols-[150px_1fr_auto] items-center gap-3">
            <span className="text-[12px] text-[#475175] truncate" title={d.label}>
              {d.label}
            </span>
            <span className="relative h-[22px] rounded-[3px] bg-[#F0F1F5] overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-[3px]"
                style={{ width: pct + "%", backgroundColor: isTop ? "#C7AA50" : "#1566FF" }}
              />
            </span>
            <span className="font-mono text-[12px] text-[#1A1F35] tabular-nums w-[64px] text-right">
              {fmtValue(d.value, unit)}
              {d.n ? <span className="block text-[10px] text-[#8B95B8]">n={d.n}</span> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small section header                                               */
/* ------------------------------------------------------------------ */

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[12px] text-[#C7AA50] tracking-widest">{index}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8B95B8]">{label}</span>
      <span className="flex-1 h-px bg-[#E6E6E6]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Template                                                           */
/* ------------------------------------------------------------------ */

export function ProjectPageTemplate({
  project,
  detail,
}: {
  project: ProjectMeta;
  detail: ProjectDetail;
}) {
  return (
    <article className="max-w-[1100px] mx-auto px-6 md:px-10 lg:px-12 py-12 md:py-16">
      {/* synthetic notice — prominent, top of every project */}
      <div className="mb-8 -mx-6 md:-mx-10 lg:-mx-12">
        <SyntheticBadge variant="banner" />
      </div>

      {/* hero */}
      <header className="mb-16">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="font-mono text-[13px] text-[#8B95B8]">
            Project {String(project.number).padStart(2, "0")}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#ECF2FE] text-[#1566FF]">
            {project.difficulty}
          </span>
          <SyntheticBadge variant="badge" />
        </div>

        <h1 className="text-[2rem] md:text-[2.75rem] font-bold text-[#1A1F35] leading-tight tracking-tight mb-4">
          {project.title}
        </h1>
        <p className="text-[1.0625rem] md:text-[1.1875rem] text-[#475175] leading-relaxed max-w-[760px]">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mt-7">
          {project.techniques.map(function renderTech(t) {
            return (
              <span
                key={t}
                className="px-3 py-1.5 rounded-md text-[12px] font-mono bg-white border border-[#E6E6E6] text-[#475175]"
              >
                {t}
              </span>
            );
          })}
        </div>
      </header>

      {/* 01 — business problem */}
      <section className="mb-16">
        <SectionLabel index="01" label="Business Problem" />
        <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold text-[#1A1F35] mb-5 leading-snug">
          {detail.businessProblem.headline}
        </h2>
        <div className="space-y-4 max-w-[780px]">
          {detail.businessProblem.paragraphs.map(function renderP(p, i) {
            return (
              <p key={i} className="text-[1rem] text-[#475175] leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {detail.businessProblem.cards.map(function renderCard(c) {
            return (
              <div key={c.label} className="rounded-xl border border-[#E6E6E6] bg-white p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#8B95B8] mb-2">
                  {c.label}
                </p>
                <p className="text-[1.0625rem] font-semibold text-[#1A1F35]">{c.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 02 — data sources */}
      <section className="mb-16">
        <SectionLabel index="02" label="Data Sources" />
        <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold text-[#1A1F35] mb-3 leading-snug">
          {detail.dataSources.headline}
        </h2>
        <p className="text-[1rem] text-[#475175] leading-relaxed max-w-[780px] mb-8">
          {detail.dataSources.description}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {detail.dataSources.tables.map(function renderTable(t) {
            return (
              <div
                key={t.name}
                className={
                  "rounded-xl border p-5 " +
                  (t.primary ? "border-[#1566FF] bg-[#F7FAFF]" : "border-[#E6E6E6] bg-white")
                }
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[13px] font-semibold text-[#1566FF]">{t.name}</span>
                  {t.primary ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1566FF] text-white">
                      PRIMARY
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {t.fields.map(function renderField(f) {
                    return (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#F0F1F5] text-[#475175]"
                      >
                        {f}
                      </span>
                    );
                  })}
                </div>
                <p className="text-[13px] text-[#8B95B8] leading-snug">{t.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 03 — methodology */}
      <section className="mb-16">
        <SectionLabel index="03" label="Methodology" />
        <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold text-[#1A1F35] mb-3 leading-snug">
          {detail.methodology.headline}
        </h2>
        <p className="text-[1rem] text-[#475175] leading-relaxed max-w-[780px] mb-8">
          {detail.methodology.description}
        </p>
        <div className="space-y-3">
          {detail.methodology.steps.map(function renderStep(s) {
            return (
              <div
                key={s.step}
                className="flex gap-4 rounded-xl border border-[#E6E6E6] bg-white p-5"
              >
                <span className="font-mono text-[15px] font-bold text-[#C7AA50] flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="text-[1rem] font-semibold text-[#1A1F35] mb-1">{s.title}</p>
                  <p className="text-[14px] text-[#475175] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 04 — analysis */}
      <section className="mb-16">
        <SectionLabel index="04" label="Analysis & Results" />
        <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold text-[#1A1F35] mb-3 leading-snug">
          {detail.analysis.headline}
        </h2>
        <p className="text-[1rem] text-[#475175] leading-relaxed max-w-[780px] mb-8">
          {detail.analysis.description}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {detail.analysis.kpis.map(function renderKpi(k) {
            return (
              <div key={k.label} className="rounded-xl border border-[#E6E6E6] bg-white p-5">
                <p
                  className="text-[1.75rem] font-bold leading-none mb-2"
                  style={{ color: k.color }}
                >
                  {k.value}
                </p>
                <p className="text-[13px] font-semibold text-[#1A1F35]">{k.label}</p>
                <p className="text-[12px] text-[#8B95B8]">{k.sub}</p>
              </div>
            );
          })}
        </div>

        {detail.analysis.charts.map(function renderChart(c) {
          if (c.data && c.data.length > 0) {
            return (
              <div key={c.title} className="rounded-xl border border-[#E6E6E6] bg-white p-6 mb-6">
                <p className="text-[0.9375rem] font-semibold text-[#1A1F35] mb-1">{c.title}</p>
                <p className="text-[13px] text-[#8B95B8] mb-5">{c.subtitle}</p>
                <InlineBars data={c.data} unit={c.unit} />
              </div>
            );
          }
          return (
            <div
              key={c.title}
              className="rounded-xl border border-dashed border-[#B8C2E3] bg-[#FAFBFE] p-12 text-center mb-6"
            >
              <p className="font-mono text-[11px] text-[#8B95B8] uppercase tracking-widest mb-2">
                Chart
              </p>
              <p className="text-[0.9375rem] font-semibold text-[#475175] mb-1">{c.title}</p>
              <p className="text-sm text-[#8B95B8]">{c.subtitle}</p>
            </div>
          );
        })}
      </section>

      {/* 05 — insights */}
      <section className="mb-16">
        <SectionLabel index="05" label="Insights" />
        <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold text-[#1A1F35] mb-7 leading-snug">
          {detail.insights.headline}
        </h2>
        <div className="space-y-4">
          {detail.insights.items.map(function renderInsight(it) {
            return (
              <div
                key={it.title}
                className="rounded-xl border-l-[3px] border-[#1566FF] bg-[#F7FAFF] p-5"
              >
                <p className="text-[1rem] font-semibold text-[#1A1F35] mb-1.5">{it.title}</p>
                <p className="text-[14px] text-[#475175] leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 06 — future work */}
      <section>
        <SectionLabel index="06" label="Production Path" />
        <h2 className="text-[1.375rem] md:text-[1.625rem] font-bold text-[#1A1F35] mb-7 leading-snug">
          {detail.future.headline}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {detail.future.items.map(function renderFuture(it) {
            return (
              <div key={it.title} className="rounded-xl border border-[#E6E6E6] bg-white p-5">
                <p className="text-[1rem] font-semibold text-[#1A1F35] mb-1.5">{it.title}</p>
                <p className="text-[14px] text-[#475175] leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
