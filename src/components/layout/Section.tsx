import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  background?: "white" | "subtle" | "dark";
  size?: "default" | "compact";
  className?: string;
}

export function Section({ children, background = "white", size = "default", className = "" }: SectionProps) {
  let bgClass = "bg-white";
  if (background === "subtle") bgClass = "bg-[#FAFBFE]";
  if (background === "dark") bgClass = "bg-[#1A1F35]";

  let padY = "py-24";
  if (size === "compact") padY = "py-16";

  return (
    <section className={bgClass + " " + className}>
      <div className={"max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 " + padY}>
        {children}
      </div>
    </section>
  );
}
