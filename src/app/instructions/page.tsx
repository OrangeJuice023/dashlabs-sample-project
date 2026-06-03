const codeSnippet = `from faker import Faker
import hashlib, random

fake = Faker()
Faker.seed(42)
random.seed(42)

# Persistent maps: same real value always maps to same fake value
name_map, branch_map, id_map = {}, {}, {}

def fake_name(real):
    if real not in name_map:
        name_map[real] = fake.name()
    return name_map[real]

def map_branch(real):
    if real not in branch_map:
        label = chr(65 + len(branch_map))   # A, B, C ...
        branch_map[real] = "Branch " + label
    return branch_map[real]

def hash_id(real):
    if real not in id_map:
        seed = "dashlabs-anon-" + str(real)
        id_map[real] = hashlib.sha256(seed.encode()).hexdigest()[:12]
    return id_map[real]

def jitter_amount(value, pct=0.15):
    factor = 1 + random.uniform(-pct, pct)
    return round(float(value) * factor, 2)`;

function SectionLabel(props: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest">{props.number}</span>
      <span className="h-px flex-1 bg-[#E6E6E6] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#8B95B8] uppercase tracking-widest">{props.label}</span>
    </div>
  );
}

const setupSteps = [
  { step: "01", title: "Clone the repository", desc: "Fork this repo to your own GitHub account, then clone it locally." },
  { step: "02", title: "Install dependencies", desc: "Run pnpm install in the project root. Node 18+ required." },
  { step: "03", title: "Start the dev server", desc: "Run pnpm dev and open localhost:3000 to see your local copy." },
];

const buildSteps = [
  { step: "01", title: "Edit project metadata", desc: "Open src/content/projects.ts and update the ProjectMeta object for your project — title, tagline, difficulty, techniques, key metric." },
  { step: "02", title: "Write your project content", desc: "Open src/content/project-details.ts and fill in the six sections: business problem, data sources, methodology, analysis, insights, future improvements." },
  { step: "03", title: "Add your results data", desc: "Drop your pre-computed JSON (chart data, model metrics) into public/data/projects/. The page reads from there." },
  { step: "04", title: "Deploy your own version", desc: "Push to your GitHub, then import the repo into your own Vercel account. You get your own live URL for your resume." },
];

export default function InstructionsPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#1A1F35] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />
        <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#8B95B8] uppercase mb-4">
            For Interns
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            How to fork this and build your own portfolio.
          </h1>
          <p className="text-[1.0625rem] text-[#8B95B8] max-w-[600px] leading-[1.7]">
            This site is a reference implementation. Use it as a template: keep the structure, swap in your own analysis, and deploy your own version under your own name.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[820px] mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-20">

        {/* Overview */}
        <section>
          <SectionLabel number="01" label="Overview" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            What you are building.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
            Each of you will build your own version of this portfolio using one or more of the nine projects. The website structure, components, and design system are already built — your job is the data science: run the analysis, produce real results, and tell the story on your project page.
          </p>
        </section>

        {/* Data privacy — important callout */}
        <section>
          <SectionLabel number="02" label="Data Privacy — Read First" />
          <div className="rounded-xl border-2 border-[#F0E068] bg-[#FFF9C4] p-6">
            <p className="font-bold text-[#475175] text-[1.0625rem] mb-3">
              You will never touch real client data.
            </p>
            <p className="text-[0.9375rem] text-[#5A6173] leading-relaxed mb-3">
              All raw client data stays in a controlled environment. Gervi runs the anonymize.py pipeline on the real data, then shares only the anonymized CSV files with you. These have fake names, generic branch labels, hashed IDs, and jittered amounts — the analytical patterns are preserved, but nothing traces back to a real patient, physician, or facility. Anonymized files will be shared via a Google Drive link, organized per client (client_anon_01, client_anon_02, etc.). Forking the repository is optional — the Google Drive link is the primary deliverable.
            </p>
            <p className="text-[0.9375rem] text-[#5A6173] leading-relaxed">
              Build your entire analysis on the anonymized files only. Never request, download, or commit raw client exports.
            </p>
          </div>
        </section>

        {/* Setup */}
        <section>
          <SectionLabel number="03" label="Setup" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-6">
            Get the project running locally.
          </h2>
          <div className="space-y-3">
            {setupSteps.map(function renderStep(s) {
              return (
                <div key={s.step} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E6E6E6]">
                  <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest flex-shrink-0 pt-0.5">{s.step}</span>
                  <div>
                    <p className="font-semibold text-[#1A1F35] text-[0.9375rem] mb-1">{s.title}</p>
                    <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* anonymize.py */}
        <section>
          <SectionLabel number="04" label="The anonymize.py Pipeline" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-4">
            How the data is made safe.
          </h2>
          <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed mb-6">
            You do not run this yourself, but you should understand what it does to the data you receive. The core logic is below. The full script lives in scripts/anonymize.py.
          </p>
          <div className="rounded-xl bg-[#1A1F35] p-5 overflow-x-auto">
            <pre className="font-mono text-[12.5px] leading-[1.7] text-[#D7DCEE] whitespace-pre">{codeSnippet}</pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
              <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">What gets masked</p>
              <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">Names, phones, emails (Faker), branch and partner names (generic labels), all IDs (SHA-256 hashes), financial amounts (jittered).</p>
            </div>
            <div className="p-5 rounded-xl bg-[#FAFBFE] border border-[#E6E6E6]">
              <p className="font-semibold text-[#475175] text-[0.9375rem] mb-2">What is preserved</p>
              <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">Age, sex, civil status, timestamps, service names, test result values, reference ranges, statuses — everything your analysis actually needs.</p>
            </div>
          </div>
        </section>

        {/* How to add your project */}
        <section>
          <SectionLabel number="05" label="Build Your Project" />
          <h2 className="text-[1.75rem] font-extrabold text-[#475175] leading-tight mb-6">
            From analysis to published page.
          </h2>
          <div className="space-y-3">
            {buildSteps.map(function renderStep(s) {
              return (
                <div key={s.step} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E6E6E6]">
                  <span className="font-mono text-[11px] font-bold text-[#8B95B8] tracking-widest flex-shrink-0 pt-0.5">{s.step}</span>
                  <div>
                    <p className="font-semibold text-[#1A1F35] text-[0.9375rem] mb-1">{s.title}</p>
                    <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
