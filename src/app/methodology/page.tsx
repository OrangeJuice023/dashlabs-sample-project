function SectionLabel(props: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest">{props.number}</span>
      <span className="h-px flex-1 bg-[#E6E6E6] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#8B95B8] uppercase tracking-widest">{props.label}</span>
    </div>
  );
}

const tables = [
  { name: "patients", desc: "Demographics: age, sex, civil status, branch, physician" },
  { name: "orders", desc: "Transactions: totals, discounts, payment status, branch, partner" },
  { name: "order_items", desc: "Line items: product and service names, discounts, statuses" },
  { name: "patient_services", desc: "Service execution: status, timestamps, workflow progression" },
  { name: "patient_service_results", desc: "Lab values and reference ranges — the richest table for modeling" },
];

const standards = [
  { title: "Honest metrics only", desc: "Every reported metric comes from real model evaluation on the anonymized data. Where a model underperforms — or where the data cannot support a project at all — the page says so plainly." },
  { title: "No data leakage", desc: "Features that would not be available at prediction time are excluded. Reference ranges, for example, are used only to create labels — never as model inputs." },
  { title: "Stated limitations", desc: "Each project ends with an honest account of what the analysis cannot do. Several projects are explicitly marked limited or in development where the data does not support a real result." },
  { title: "Validation discipline", desc: "Stratified splits, cross-validation, and metrics appropriate to each problem (AUC-ROC, MAE, lift, silhouette) rather than accuracy alone." },
];

export default function MethodologyPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#1A1F35] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />
        <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#8B95B8] uppercase mb-4">
            Methodology
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            How anonymized data becomes trustworthy analysis.
          </h1>
          <p className="text-[1.0625rem] text-[#8B95B8] max-w-[600px] leading-[1.7]">
            Every project on this site is built on real healthcare operations data that has been fully anonymized. Here is how that works — and why the findings still hold.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[820px] mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-20">

        {/* The data */}
        <section>
          <SectionLabel number="01" label="The Data" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            Thirteen organizations, one shared schema.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-8">
            The data comes from thirteen diagnostic laboratory and clinic organizations across the Philippines and Indonesia. All of them share the same five-table data model, which is what makes cross-client analysis possible. The exports used here are anonymized samples, so the projects report rates and patterns rather than population totals.
          </p>
          <div className="space-y-3">
            {tables.map(function renderTable(t, i) {
              var last = i === 4;
              var cls = "p-5 rounded-xl border " + (last ? "border-[#BFD0F0] bg-[#ECF2FE]/40" : "border-[#E6E6E6] bg-white");
              return (
                <div key={t.name} className={cls}>
                  <code className={"font-mono text-sm font-bold " + (last ? "text-[#1566FF]" : "text-[#475175]")}>{t.name}</code>
                  <p className="text-[0.875rem] text-[#5A6173] mt-1.5">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Anonymization */}
        <section>
          <SectionLabel number="02" label="Anonymization" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            Deny by default: what is masked, dropped, and kept.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-6">
            All data passes through a custom Python pipeline before any analysis. It classifies every column by the shape of its name and is deny-by-default: anything that looks identifying is masked or dropped unless it is explicitly on the keep list. A column the script has never seen fails closed — masked, not let through. The goal is to remove everything that could identify a real person or organization while preserving the statistical structure that makes the analysis meaningful.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
              <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">Masked or dropped</p>
              <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">Patient, physician, and staff names, phones, and emails (replaced with realistic fakes). Branch and partner names become generic labels. All IDs are hashed. Financial amounts are jittered. Dates of birth and fine-grained location (city, barangay) are dropped entirely. Barcodes, receipts, and tax numbers are dropped.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
              <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">Preserved</p>
              <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">Age, sex, civil status, timestamps, service and test names, result values, reference ranges, and workflow statuses — the fields that carry the analytical signal. Free-text fields are kept but flagged for review, since clinical narrative can contain stray names that need a separate scrub before any public display.</p>
            </div>
          </div>
        </section>

        {/* Standards */}
        <section>
          <SectionLabel number="03" label="Analytical Standards" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-6">
            The rules every project follows.
          </h2>
          <div className="space-y-3">
            {standards.map(function renderStandard(s, i) {
              return (
                <div key={i} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E6E6E6]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ECF2FE] flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#1566FF]" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#1A1F35] text-[0.9375rem] mb-1">{s.title}</p>
                    <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why it still works */}
        <section>
          <SectionLabel number="04" label="Why It Still Holds" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            Anonymized data still tells a real story.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-4">
            Masking identifiers does not change the relationships in the data. A 60-year-old patient is still 60. An abnormal result is still abnormal. The time between sample collection and result is unchanged. Because the analytically meaningful fields are preserved, the models learn the same patterns they would on the raw data.
          </p>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
            The one deliberate exception is financial amounts, which are jittered by about 15%. This blurs exact peso figures while keeping distributions and outliers intact — which is why the revenue anomaly project reports patterns rather than exact amounts, and treats its results as illustrative.
          </p>
        </section>

      </div>
    </div>
  );
}
