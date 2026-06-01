import { projects } from "@/content/projects";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectSidebar } from "@/components/project/ProjectSidebar";

const project = projects.find((p) => p.slug === "01-abnormal-results")!;

export const metadata = {
  title: project.title,
  description: project.tagline,
};

export default function AbnormalResultsPage() {
  return (
    <>
      {/* Full-width hero — above the sidebar layout */}
      <ProjectHero project={project} />

      {/* Sidebar + content layout */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 py-16">
        <div className="flex gap-12">

          {/* Sidebar */}
          <ProjectSidebar
            projectNumber={project.number}
            projectTitle={project.title}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-20">

            {/* 01 — Business Problem */}
            <section id="business-problem" className="scroll-mt-24">
              <SectionLabel number="01" label="Business Problem" />
              <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
                Why do some lab results come back abnormal — and can we predict it?
              </h2>
              <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-6">
                Diagnostic laboratories process thousands of results daily. Currently, abnormal
                results are only identified after the lab machine transmits the value and a
                technician reviews it against the reference range. There is no proactive
                flagging before a test is processed.
              </p>
              <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-6">
                This project asks: given what we know about a patient at registration time
                (age, sex, service type, branch), can we predict whether their result is
                likely to be abnormal? If yes, labs could prioritize certain samples,
                prepare for follow-up consultations, or alert the ordering physician earlier.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  { label: "Problem Type", value: "Binary Classification" },
                  { label: "Target Variable", value: "is_abnormal (0 / 1)" },
                  { label: "Operational Value", value: "Early flagging & prioritization" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
                    <p className="font-mono text-[10px] text-[#8B95B8] uppercase tracking-widest mb-2">{label}</p>
                    <p className="font-semibold text-[#475175] text-[0.9375rem]">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 02 — Data Sources */}
            <section id="data-sources" className="scroll-mt-24">
              <SectionLabel number="02" label="Data Sources" />
              <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
                Three tables, three anonymized client organizations.
              </h2>
              <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-8">
                All data passed through the <code className="font-mono text-sm bg-[#ECF2FE] text-[#1566FF] px-1.5 py-0.5 rounded">anonymize.py</code> pipeline
                before analysis. Patient names, physician names, branch names, and partner
                identifiers were replaced. Age, sex, service type, and result values are preserved.
              </p>
              <div className="space-y-3">
                {[
                  {
                    table: "patient_service_results",
                    fields: ["number_value", "ref_range_min", "ref_range_max", "unit"],
                    note: "Source of truth for labeling — is_abnormal derived from number_value vs reference range",
                    highlight: true,
                  },
                  {
                    table: "patient_services",
                    fields: ["service_name", "created_at", "collected_at", "status"],
                    note: "Service type and timestamp features",
                    highlight: false,
                  },
                  {
                    table: "patients",
                    fields: ["patient_age", "patient_sex"],
                    note: "Demographic features — only age and sex used, all identifiers dropped",
                    highlight: false,
                  },
                ].map(({ table, fields, note, highlight }) => (
                  <div
                    key={table}
                    className={`p-5 rounded-xl border ${highlight ? "border-[#BFD0F0] bg-[#ECF2FE]/40" : "border-[#E6E6E6] bg-white"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <code className={`font-mono text-sm font-bold ${highlight ? "text-[#1566FF]" : "text-[#475175]"}`}>
                        {table}
                      </code>
                      {highlight && (
                        <span className="font-mono text-[10px] text-[#C7AA50] font-semibold tracking-widest">
                          ★ PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {fields.map((f) => (
                        <span key={f} className="font-mono text-[11px] bg-white border border-[#E6E6E6] text-[#5D6690] px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-[0.875rem] text-[#8B95B8]">{note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 03 — Methodology */}
            <section id="methodology" className="scroll-mt-24">
              <SectionLabel number="03" label="Methodology" />
              <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
                Label → engineer → train → validate.
              </h2>
              <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-8">
                The key challenge in this project is that the target variable doesn't
                exist in the raw data — it must be derived. A result is labeled abnormal
                when its <code className="font-mono text-sm bg-[#ECF2FE] text-[#1566FF] px-1.5 py-0.5 rounded">number_value</code> falls
                outside the reference range defined by <code className="font-mono text-sm bg-[#ECF2FE] text-[#1566FF] px-1.5 py-0.5 rounded">ref_range_min</code> and <code className="font-mono text-sm bg-[#ECF2FE] text-[#1566FF] px-1.5 py-0.5 rounded">ref_range_max</code>.
              </p>
              <div className="space-y-3">
                {[
                  { step: "01", title: "Label Generation", desc: "is_abnormal = 1 if number_value < ref_range_min OR number_value > ref_range_max. Null values excluded." },
                  { step: "02", title: "Feature Engineering", desc: "Age bins (0-18, 19-40, 41-60, 60+), sex encoding, service category encoding, day-of-week collected, branch (anonymized)." },
                  { step: "03", title: "Class Imbalance Handling", desc: "Abnormal results are the minority class (~23%). SMOTE applied on training set only to avoid leakage." },
                  { step: "04", title: "Model Training", desc: "Logistic Regression (baseline), Random Forest (ensemble), XGBoost (gradient boosting). 80/20 stratified split." },
                  { step: "05", title: "Validation", desc: "AUC-ROC as primary metric (handles imbalance better than accuracy). Precision-recall curve reviewed. No data leakage — reference ranges only used for labeling, not as features." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E6E6E6]">
                    <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest flex-shrink-0 pt-0.5">
                      {step}
                    </span>
                    <div>
                      <p className="font-semibold text-[#1A1F35] text-[0.9375rem] mb-1">{title}</p>
                      <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 04 — Interactive Analysis */}
            <section id="interactive-analysis" className="scroll-mt-24">
              <SectionLabel number="04" label="Interactive Analysis" />
              <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
                Model results and key distributions.
              </h2>
              <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-8">
                Results below use placeholder data. Real chart values will be populated
                after the anonymized dataset is processed through the ML pipeline.
              </p>

              {/* KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { value: "87%",   label: "AUC Score",          sub: "XGBoost (best model)", color: "#27AE60" },
                  { value: "79%",   label: "Precision",           sub: "Abnormal class",       color: "#1566FF" },
                  { value: "71%",   label: "Recall",              sub: "Abnormal class",       color: "#1566FF" },
                  { value: "23.4%", label: "Abnormal Rate",       sub: "Across all services",  color: "#C7AA50" },
                ].map(({ value, label, sub, color }) => (
                  <div key={label} className="p-5 rounded-xl border border-[#E6E6E6] bg-white">
                    <p className="text-[1.75rem] font-extrabold font-mono leading-none tracking-tight mb-1" style={{ color }}>
                      {value}
                    </p>
                    <p className="text-[0.875rem] font-semibold text-[#1A1F35] mb-0.5">{label}</p>
                    <p className="text-[0.75rem] text-[#8B95B8]">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-xl border border-dashed border-[#B8C2E3] bg-[#FAFBFE] p-12 text-center mb-6">
                <p className="font-mono text-[11px] text-[#8B95B8] uppercase tracking-widest mb-2">
                  Chart Placeholder
                </p>
                <p className="text-[0.9375rem] font-semibold text-[#475175] mb-1">
                  Abnormal Rate by Service Type
                </p>
                <p className="text-sm text-[#8B95B8]">
                  Bar chart — will render once anonymized JSON data is loaded
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-[#B8C2E3] bg-[#FAFBFE] p-12 text-center">
                <p className="font-mono text-[11px] text-[#8B95B8] uppercase tracking-widest mb-2">
                  Chart Placeholder
                </p>
                <p className="text-[0.9375rem] font-semibold text-[#475175] mb-1">
                  Feature Importance — XGBoost
                </p>
                <p className="text-sm text-[#8B95B8]">
                  Horizontal bar chart — top 10 features by importance score
                </p>
              </div>
            </section>

            {/* 05 — Insights */}
            <section id="insights" className="scroll-mt-24">
              <SectionLabel number="05" label="Insights" />
              <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
                What the model tells us operationally.
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Age is the strongest demographic predictor",
                    desc: "Patients aged 60+ show significantly higher abnormal rates across hematology and clinical chemistry panels. Age bins contribute the most to XGBoost feature importance.",
                  },
                  {
                    title: "Service type dominates over demographics",
                    desc: "The type of test ordered (CBC, urinalysis, clinical chemistry) is a stronger predictor than patient demographics. This suggests test-specific baseline rates matter more than who the patient is.",
                  },
                  {
                    title: "23% abnormal rate means early flagging has real scale",
                    desc: "Roughly 1 in 4 results is abnormal. A model that pre-flags high-risk samples could meaningfully reduce the time between collection and physician notification.",
                  },
                  {
                    title: "Honest limitation: reference range quality varies",
                    desc: "Some services have null or implausible reference ranges in the dataset. These were excluded but represent a data quality issue that would affect a production deployment.",
                  },
                ].map(({ title, desc }, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E6E6E6]">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ECF2FE] flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#1566FF]" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#1A1F35] text-[0.9375rem] mb-1">{title}</p>
                      <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 06 — Future Improvements */}
            <section id="future-improvements" className="scroll-mt-24">
              <SectionLabel number="06" label="Future Improvements" />
              <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
                What a production version would need.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Live inference API",
                    desc: "A FastAPI endpoint that accepts patient registration data and returns an abnormality probability score before the sample is processed.",
                  },
                  {
                    title: "Service-specific models",
                    desc: "One global model conflates very different tests. Separate models per service category (hematology, urinalysis, biochemistry) would likely perform better.",
                  },
                  {
                    title: "Physician feedback loop",
                    desc: "Clinician-confirmed diagnoses as ground truth would be far stronger labels than rule-based reference range comparisons.",
                  },
                  {
                    title: "Temporal validation",
                    desc: "The current model doesn't account for concept drift. A time-series split validation and periodic retraining schedule would be needed in production.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
                    <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">{title}</p>
                    <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}

// ── Helper component ──────────────────────────────────────────────────────────
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest">
        {number}
      </span>
      <span className="h-px flex-1 bg-[#E6E6E6] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#8B95B8] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
