"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Database, BrainCircuit, BarChart3 } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const pillars = [
  {
    icon: Database,
    title: "Real Healthcare Data",
    description:
      "Built on operational data from diagnostic laboratories across the Philippines and Indonesia — patient services, lab results, orders, and clinical notes.",
  },
  {
    icon: ShieldCheck,
    title: "Fully Anonymized",
    description:
      "Every dataset passes through a custom anonymize.py pipeline. No real patient names, physician names, branch names, or partner identifiers exist anywhere in this repository.",
  },
  {
    icon: BrainCircuit,
    title: "End-to-End ML",
    description:
      "Each project covers the full lifecycle: problem framing, feature engineering, model training, validation, and business interpretation — not just notebooks.",
  },
  {
    icon: BarChart3,
    title: "Business-First Framing",
    description:
      "Every model is anchored to an operational problem — SLA breaches, turnaround delays, revenue anomalies. Accuracy metrics alone don't tell the story.",
  },
];

export function WhyShowcase() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1200px] mx-auto px-6">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Section header */}
          <motion.div variants={fadeUp} className="mb-16 max-w-[640px]">
            <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#8B95B8] uppercase mb-4">
              Why This Exists
            </p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#475175] leading-tight tracking-tight mb-5">
              Healthcare data is uniquely rich.
              <br />
              Most portfolios never touch it.
            </h2>
            <p className="text-[1.0625rem] text-[#5A6173] leading-relaxed">
              Diagnostic laboratories generate dense operational and clinical data every day.
              This showcase demonstrates what becomes possible when that data is properly
              structured, anonymized, and analyzed.
            </p>
          </motion.div>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  variants={fadeUp}
                  className="
                    group p-8 rounded-xl border border-[#E6E6E6]
                    hover:border-[#B8C2E3] hover:shadow-[0_4px_24px_rgba(71,81,117,0.08)]
                    transition-all duration-200 bg-white
                  "
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="
                      flex-shrink-0 w-11 h-11 rounded-lg
                      bg-[#ECF2FE] flex items-center justify-center
                      group-hover:bg-[#1566FF] transition-colors duration-200
                    ">
                      <Icon
                        size={20}
                        className="text-[#1566FF] group-hover:text-white transition-colors duration-200"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-[1rem] font-semibold text-[#1A1F35] mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-[0.9375rem] text-[#5A6173] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
