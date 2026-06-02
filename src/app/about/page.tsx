function SectionLabel(props: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest">{props.number}</span>
      <span className="h-px flex-1 bg-[#E6E6E6] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#8B95B8] uppercase tracking-widest">{props.label}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#1A1F35] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />
        <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#8B95B8] uppercase mb-4">
            About
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            A healthcare data science showcase.
          </h1>
          <p className="text-[1.0625rem] text-[#8B95B8] max-w-[600px] leading-[1.7]">
            Built by the Dashlabs.ai data team to demonstrate how real diagnostic laboratory data becomes analytics and machine learning — responsibly.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[820px] mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-20">

        {/* What this is */}
        <section>
          <SectionLabel number="01" label="What This Is" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            A portfolio, a teaching tool, and a reference.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-4">
            This site collects nine end-to-end data science projects built on anonymized healthcare operations data. Each one starts from a real business problem a diagnostic laboratory faces — abnormal result flagging, turnaround delays, revenue anomalies — and works through to a model, an evaluation, and an honest set of conclusions.
          </p>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
            It also serves as a reference implementation. The data science interns on the team use this structure as a template to build and publish their own portfolios.
          </p>
        </section>

        {/* Who built it */}
        <section>
          <SectionLabel number="02" label="Who Built It" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            The Dashlabs data team.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
            The reference implementation was built by the Data Team Head at Dashlabs.ai, who leads the analytics and data science function — building dashboards, querying operational data, and mentoring the intern cohort. The projects here reflect the kind of work the team does day to day, reframed as portfolio case studies on anonymized data.
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <SectionLabel number="03" label="Important" />
          <div className="rounded-xl border border-[#E6E6E6] bg-[#FAFBFE] p-6">
            <p className="font-semibold text-[#475175] text-[1rem] mb-2">Not an official Dashlabs product</p>
            <p className="text-[0.9375rem] text-[#5A6173] leading-relaxed">
              This is an educational portfolio showcase. It is not an official Dashlabs.ai product or service. All data shown is anonymized and any metrics are illustrative of the analytical approach. Nothing here exposes real patient, physician, or client information.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
