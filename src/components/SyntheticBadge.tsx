import { FlaskConical } from "lucide-react";

/**
 * SyntheticBadge — signals that all data and results are fabricated.
 *
 *   variant="badge"   compact pill, used on project pages / hero
 *   variant="banner"  full-width strip, used on the homepage + project top
 */
export function SyntheticBadge({ variant = "badge" }: { variant?: "badge" | "banner" }) {
  if (variant === "banner") {
    return (
      <div className="w-full bg-[#FFF6D6] border-y border-[#E8D792]">
        <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-3 flex items-center gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-md bg-[#C7AA50] flex items-center justify-center">
            <FlaskConical size={15} className="text-white" />
          </span>
          <p className="text-[0.8125rem] md:text-[0.875rem] text-[#6B5A1E] leading-snug">
            <span className="font-bold">Synthetic data.</span>{" "}
            Every patient, result, and metric on this site is fabricated by a generator built to mirror
            real lab structure. Nothing here is a real person, result, or finding — the work shows the{" "}
            <span className="font-semibold">methods</span>, not real outcomes.
          </p>
        </div>
      </div>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono tracking-wide bg-[#FFF6D6] text-[#9C7A1A] border border-[#E8D792]">
      <FlaskConical size={12} className="text-[#C7AA50]" />
      SYNTHETIC DATA
    </span>
  );
}
