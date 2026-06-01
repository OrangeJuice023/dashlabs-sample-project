"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const stats = [
  { value: "300+", label: "Healthcare Facilities" },
  { value: "15M+", label: "Patients in Dataset" },
  { value: "9", label: "ML Projects" },
  { value: "5", label: "Client Organizations" },
];

export function Hero() {
  return (
    <section className="relative bg-[#1A1F35] overflow-hidden">

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />

      {/* Blue glow */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #1566FF, transparent 70%)" }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-20 pb-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[720px]"
        >

          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-[#8B95B8] uppercase">
              <ShieldCheck size={13} className="text-[#C7AA50]" />
              Healthcare Data Science Portfolio
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.07] tracking-tight mb-6"
          >
            From raw healthcare data
            <br />
            to{" "}
            <span className="text-[#1566FF]">machine learning</span>
            <br />
            solutions.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-[1.0625rem] text-[#8B95B8] leading-relaxed max-w-[520px] mb-10"
          >
            Nine end-to-end analytics and ML projects built on anonymized
            diagnostic lab data — demonstrating how healthcare operations
            data becomes actionable intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-20">
            <Link
              href="/projects"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                bg-[#1566FF] text-white font-semibold text-sm
                hover:bg-[#4273C0] transition-colors duration-200 cursor-pointer
              "
            >
              View All Projects
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/methodology"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                border border-[#475175] text-[#D7DCEE] font-semibold text-sm
                hover:bg-[#475175]/30 transition-colors duration-200 cursor-pointer
              "
            >
              How It Works
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-[#475175]/40"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[2rem] font-extrabold text-white font-mono tracking-tight leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-[#8B95B8] font-medium tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
