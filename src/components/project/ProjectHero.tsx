import Link from "next/link";
import type { ProjectMeta } from "@/lib/types";

const difficultyColors = {
  Beginner:     { color: "#27AE60", bg: "#E8F5E9" },
  Intermediate: { color: "#B8860B", bg: "#F7F3DF" },
  Advanced:     { color: "#C0392B", bg: "#FCE4EC" },
};

const statusLabels = {
  complete:      "Complete",
  "in-progress": "In Progress",
  placeholder:   "Coming Soon",
};

interface ProjectHeroProps {
  project: ProjectMeta;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const diff = difficultyColors[project.difficulty];

  return (
    <div className="bg-[#1A1F35] relative overflow-hidden">
      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />

      <div className="max-w-[1200px] mx-auto px-8 md:px-12 pt-16 pb-14">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B95B8] mb-8">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-white transition-colors cursor-pointer">
            Projects
          </Link>
          <span>/</span>
          <span className="text-[#D7DCEE]">
            {String(project.number).padStart(2, "0")}
          </span>
        </div>

        {/* Top tags row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold"
            style={{ color: diff.color, backgroundColor: `${diff.bg}22` }}
          >
            {project.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#475175]/40 text-[#D7DCEE]">
            {statusLabels[project.status]}
          </span>
          {project.clients.slice(0, 2).map((c) => (
            <span
              key={c}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#475175]/20 text-[#8B95B8]"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-[2rem] md:text-[2.75rem] font-extrabold text-white leading-tight tracking-tight mb-4">
          {project.title}
        </h1>

        {/* Tagline */}
        <p className="text-[1.0625rem] text-[#8B95B8] leading-relaxed max-w-[600px] mb-10">
          {project.tagline}
        </p>

        {/* Key metric + techniques row */}
        <div className="flex flex-wrap items-end gap-10 pt-8 border-t border-[#475175]/40">
          {project.keyMetric && (
            <div>
              <p className="text-[2.5rem] font-extrabold text-white font-mono leading-none tracking-tight">
                {project.keyMetric.value}
              </p>
              <p className="text-xs text-[#8B95B8] font-mono uppercase tracking-widest mt-1">
                {project.keyMetric.label}
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-mono text-[#8B95B8] uppercase tracking-widest mb-2">
              Techniques
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techniques.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#475175]/40 text-[#D7DCEE]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-[#8B95B8] uppercase tracking-widest mb-2">
              Tables Used
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tables.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md text-[12px] font-mono bg-[#475175]/40 text-[#D7DCEE]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
