"use client";

import { useEffect, useState } from "react";

export interface SidebarSection {
  id: string;
  label: string;
  number: string;
}

export const PROJECT_SECTIONS: SidebarSection[] = [
  { id: "business-problem", label: "Business Problem", number: "01" },
  { id: "data-sources", label: "Data Sources", number: "02" },
  { id: "methodology", label: "Methodology", number: "03" },
  { id: "interactive-analysis", label: "Interactive Analysis", number: "04" },
  { id: "insights", label: "Insights", number: "05" },
  { id: "future-improvements", label: "Future Improvements", number: "06" },
];

interface ProjectSidebarProps {
  projectNumber: number;
  projectTitle: string;
}

export function ProjectSidebar({ projectNumber, projectTitle }: ProjectSidebarProps) {
  const [activeId, setActiveId] = useState("business-problem");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    PROJECT_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <aside className="hidden lg:block w-[220px] flex-shrink-0">
        <div className="sticky top-24">
          <div className="mb-6 pb-5 border-b border-[#E6E6E6]">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#8B95B8] uppercase mb-1">
              Project {String(projectNumber).padStart(2, "0")}
            </p>
            <p className="text-[0.8125rem] font-semibold text-[#475175] leading-snug">
              {projectTitle}
            </p>
          </div>
          <nav className="flex flex-col gap-0.5">
            {PROJECT_SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-all duration-150 cursor-pointer " +
                    (isActive
                      ? "bg-[#ECF2FE] text-[#1566FF]"
                      : "text-[#5A6173] hover:bg-[#F7F8FC] hover:text-[#475175]")
                  }
                >
                  <span
                    className={
                      "font-mono text-[10px] font-semibold tracking-widest flex-shrink-0 transition-colors duration-150 " +
                      (isActive ? "text-[#1566FF]" : "text-[#8B95B8] group-hover:text-[#5D6690]")
                    }
                  >
                    {section.number}
                  </span>
                  <span className="text-[0.8125rem] font-medium leading-snug">
                    {section.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-1 h-1 rounded-full bg-[#1566FF] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="mt-8 pt-5 border-t border-[#E6E6E6]">
            
              href="/projects"
              className="flex items-center gap-2 text-[0.8125rem] text-[#8B95B8] hover:text-[#475175] transition-colors duration-150 cursor-pointer"
            >
              <span className="text-lg leading-none">&larr;</span>
              All Projects
            </a>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1F35] text-white text-sm font-semibold shadow-lg cursor-pointer"
        >
          <span className="font-mono text-xs">
            {PROJECT_SECTIONS.find((s) => s.id === activeId)?.number ?? "01"}
          </span>
          Sections
        </button>
        {mobileOpen && (
          <div className="absolute bottom-14 right-0 w-56 bg-white border border-[#E6E6E6] rounded-xl shadow-xl overflow-hidden">
            {PROJECT_SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <button
                  key={section.id}
