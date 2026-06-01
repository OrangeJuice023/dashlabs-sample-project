"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Database } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { projects } from "@/content/projects";
import type { Difficulty, ProjectStatus } from "@/lib/types";

const difficultyConfig: Record<Difficulty, { label: string; color: string; bg: string }> = {
  Beginner:     { label: "Beginner",     color: "#27AE60", bg: "#E8F5E9" },
  Intermediate: { label: "Intermediate", color: "#B8860B", bg: "#F7F3DF" },
  Advanced:     { label: "Advanced",     color: "#C0392B", bg: "#FCE4EC" },
};

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  complete:     { label: "Complete",     color: "#27AE60" },
  "in-progress": { label: "In Progress", color: "#C7AA50" },
  placeholder:  { label: "Coming Soon",  color: "#8B95B8" },
};

export function ProjectGrid() {
  return (
    <section className="bg-[#FAFBFE] py-24">
      <div className="max-w-[1200px] mx-auto px-6">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-14 max-w-[600px]">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#8B95B8] uppercase mb-4">
              Featured Projects
            </p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#475175] leading-tight tracking-tight mb-5">
              Nine projects.
              <br />
              One healthcare dataset.
            </h2>
            <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
              From beginner classification to advanced multilingual NLP —
              each project is a standalone case study with real data,
              honest metrics, and operational context.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const diff = difficultyConfig[project.difficulty];
              const status = statusConfig[project.status];
              const isAvailable = project.status !== "placeholder";

              return (
                <motion.div key={project.slug} variants={fadeUp}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`
                      group flex flex-col h-full rounded-xl border bg-white
                      transition-all duration-200
                      ${isAvailable
                        ? "border-[#E6E6E6] hover:border-[#B8C2E3] hover:shadow-[0_4px_24px_rgba(71,81,117,0.10)] cursor-pointer"
                        : "border-[#E6E6E6] opacity-60 cursor-default pointer-events-none"
                      }
                    `}
                  >
                    {/* Card top accent */}
                    <div className="h-[3px] rounded-t-xl bg-[#1566FF] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    <div className="flex flex-col flex-1 p-6">

                      {/* Top row — number + status */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-[11px] font-semibold text-[#8B95B8] tracking-widest">
                          {String(project.number).padStart(2, "0")}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-mono"
                          style={{ color: status.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.label}
                        </span>
                      </div>

                      {/* Key metric */}
                      {project.keyMetric && (
                        <div className="mb-4">
                          <p className="text-[2rem] font-extrabold text-[#475175] font-mono leading-none tracking-tight">
                            {project.keyMetric.value}
                          </p>
                          <p className="text-[11px] text-[#8B95B8] font-mono uppercase tracking-widest mt-0.5">
                            {project.keyMetric.label}
                          </p>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-[1rem] font-bold text-[#1A1F35] leading-snug mb-2">
                        {project.title}
                      </h3>

                      {/* Tagline */}
                      <p className="text-[0.875rem] text-[#5A6173] leading-relaxed flex-1 mb-5">
                        {project.tagline}
                      </p>

                      {/* Tags row */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {/* Difficulty */}
                        <span
                          className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold"
                          style={{ color: diff.color, backgroundColor: diff.bg }}
                        >
                          {diff.label}
                        </span>
                        {/* First 2 techniques */}
                        {project.techniques.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F7F8FC] text-[#5D6690]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Footer row */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#F0F1F5]">
                        <div className="flex items-center gap-1 text-[11px] text-[#8B95B8]">
                          <Database size={11} />
                          <span>{project.tables.length} tables</span>
                        </div>
                        {isAvailable && (
                          <span className="
                            inline-flex items-center gap-1 text-[12px] font-semibold
                            text-[#1566FF] group-hover:gap-2 transition-all duration-150
                          ">
                            View Project
                            <ArrowRight size={12} />
                          </span>
                        )}
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
