"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { HeroNetwork } from "@/components/home/HeroNetwork";

const stats = [
  { value: "13", label: "Synthetic Clients" },
  { value: "9", label: "ML Projects" },
  { value: "6", label: "Data Tables" },
  { value: "100%", label: "Synthetic Data" },
];

export function Hero() {
  return (
    <section className="relative bg-[#1A1F35] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <HeroNetwork />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #1566FF, transparent 70%)" }} />

      <div className="relative max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] pt-[112px] pb-[128px]">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-[760px]">

          <motion.div variants={fadeUp} className="mb-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#8B95B8] uppercase">
              <ShieldCheck size={13} className="text-[#C7AA50]" />
              Healthcare Data Science Portfolio
            </span>
            <SyntheticBadge variant="badge" />
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.02em] mb-7">
            From realistic synthetic data to <span className="text-[#1566FF]">machine learning</span> solutions.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[1.125rem] text-[#8B95B8] leading-[1.7] max-w-[580px] mb-10">
            End-to-end analytics and ML projects built on a fully synthetic dataset spanning 13 simulated lab sites — generated to mirror the structure of real diagnostic-lab data. The data is fabricated; the methods are real.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-24">
            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1566FF] text-white font-semibold text-sm hover:bg-[#4273C0] transition-colors duration-200 cursor-pointer">
              View All Projects
              <ArrowRight size={15} />
            </Link>
            <Link href="/methodology" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#475175] text-[#D7DCEE] font-semibold text-sm hover:bg-[#475175]/30 transition-colors duration-200 cursor-pointer">
              How It Works
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-[#475175]/40">
            {stats.map(function renderStat(stat) {
              return (
                <div key={stat.label}>
                  <p className="text-[2rem] font-extrabold text-white font-mono tracking-tight leading-none mb-1.5">{stat.value}</p>
                  <p className="text-xs text-[#8B95B8] font-medium tracking-wide">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
