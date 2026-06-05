import { SyntheticBadge } from "@/components/SyntheticBadge";

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
  { name: "patient_services", desc: "Service execution: status, collection and lock timestamps" },
  { name: "patient_service_results", desc: "Lab values and reference ranges — the richest table for modeling" },
  { name: "support_tickets / soap_analytics", desc: "Per-site extras: CS tickets at one site, SOAP notes at another" },
];

const standards = [
  { title: "Real models, synthetic data", desc: "Every metric comes from running a real model on the synthetic data — actual train/test splits, actual scoring. What is fabricated is the data, not the evaluation." },
  { title: "No data leakage", desc: "Features that would not exist at prediction time are excluded. Reference ranges, for example, create the abnormal label but are never fed to the model as inputs." },
  { title: "Findings are illustrative", desc: "Because the signal in the data was engineered into the generator, the numbers show that the method works — not that a real-world fact was discovered. Each project says so plainly." },
  { title: "Validation discipline", desc: "Stratified splits, held-out test sets, and metrics matched to each problem (AUC-ROC, MAE, lift, silhouette) rather than accuracy alone." },
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
            A synthetic dataset, built to exercise real methods.
          </h1>
          <p className="text-[1.0625rem] text-[#8B95B8] max-w-[640px] leading-[1.7]">
            Every project on this site runs on data that was generated, not collected. No real patient, result, or client appears anywhere. Here is how the dataset is built — and why the analysis is still a faithful demonstration of the methods.
          </p>
        </div>
      </div>

      <SyntheticBadge variant="banner" />

      {/* Content */}
      <div className="max-w-[820px] mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-20">

        {/* The data */}
        <section>
          <SectionLabel number="01" label="The Data Model" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            Thirteen synthetic sites, one shared schema.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-8">
            The generator produces thirteen simulated diagnostic-lab sites that all share the same data model — the same shape a real laboratory information system exports. That shared schema is what makes cross-site analysis possible. Two sites carry extra tables: one has a support-ticket log, another has free-text SOAP notes, mirroring how real client exports differ.
          </p>
          <div className="space-y-3">
            {tables.map(function renderTable(t, i) {
              var rich = i === 4;
              var cls = "p-5 rounded-xl border " + (rich ? "border-[#BFD0F0] bg-[#ECF2FE]/40" : "border-[#E6E6E6] bg-white");
              return (
                <div key={t.name} className={cls}>
                  <code className={"font-mono text-sm font-bold " + (rich ? "text-[#1566FF]" : "text-[#475175]")}>{t.name}</code>
                  <p className="text-[0.875rem] text-[#5A6173] mt-1.5">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Generation */}
        <section>
          <SectionLabel number="02" label="Generation" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            Engineered signal, fabricated rows.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-6">
            A single self-contained Python script (<code className="font-mono text-[0.9rem] text-[#1566FF]">generate_synthetic.py</code>, shown in full on the Instructions page) produces every row. Distribution shapes — age curves, test mixes, reference ranges, turnaround spreads — were tuned to resemble real diagnostic-lab data, then baked into the script as fixed parameters. The generator never reads any real data at runtime, which is exactly why it is safe to publish, commit, and hand to interns.
          </p>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-6">
            Each project also has signal deliberately engineered in, so the analysis has something real to find: abnormality that rises with age and test type, turnaround that spikes on Monday mornings, patients that fall into distinct visit-behavior segments, tests that co-occur in clinically sensible bundles, and so on.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
              <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">Engineered in</p>
              <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">Age- and test-driven abnormal rates, weekday and peak-hour turnaround effects, per-patient visit segments, test-bundle co-occurrence, seeded revenue anomalies, keyword-separable ticket categories, multilingual radiology impressions, and per-site operational offsets so benchmarking shows real spread.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
              <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">Kept playful, kept clear</p>
              <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">Patient names mix ordinary fakes with a few pop-culture and fantasy easter eggs, and some addresses come from places that do not exist — a deliberate signal that no row is a real person. The clinical columns stay realistic so the data science reads professionally.</p>
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
          <SectionLabel number="04" label="Why It Still Demonstrates Skill" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            The pipeline is identical to one run on real data.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-4">
            Loading six related tables, joining them on the right keys, engineering features from timestamps and categories, handling class imbalance, choosing the right metric, validating on held-out data — all of that is exactly what these projects do, and exactly what the same work on real data would require. Swap the synthetic files for real exports and the code runs unchanged.
          </p>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
            What changes is the claim. A 0.78 AUC here means the model recovered the signal that was engineered into the generator — not that a real clinical pattern was discovered. So every project reports its numbers as a demonstration of method, and the production-path section spells out what a real deployment would still need: real labeled outcomes, temporal validation, and live inference.
          </p>
        </section>

      </div>
    </div>
  );
}
