"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-[400] w-full transition-all duration-300
        ${isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E6E6E6] shadow-sm"
          : "bg-white border-b border-transparent"
        }
      `}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1566FF] rounded"
        >
          <Image
            src="/logo/dashlabs-blue.jpg"
            alt="Dashlabs.ai"
            width={140}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                px-4 py-2 rounded-md text-sm font-medium
                text-[#5A6173] hover:text-[#475175] hover:bg-[#F7F8FC]
                transition-colors duration-150 cursor-pointer
              "
            >
              {link.label}
            </Link>
          ))}

          {/* CTA */}
          <Link
            href="/projects"
            className="
              ml-4 px-4 py-2 rounded-md text-sm font-semibold
              bg-[#1566FF] text-white
              hover:bg-[#4273C0] transition-colors duration-150
              cursor-pointer
            "
          >
            View Projects
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 rounded-md text-[#5A6173] hover:bg-[#F7F8FC] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-[#E6E6E6] bg-white px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="
                px-4 py-3 rounded-md text-sm font-medium
                text-[#5A6173] hover:text-[#475175] hover:bg-[#F7F8FC]
                transition-colors duration-150 cursor-pointer
              "
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/projects"
            onClick={() => setIsMobileOpen(false)}
            className="
              mt-2 px-4 py-3 rounded-md text-sm font-semibold text-center
              bg-[#1566FF] text-white hover:bg-[#4273C0]
              transition-colors duration-150 cursor-pointer
            "
          >
            View Projects
          </Link>
        </div>
      )}
    </header>
  );
}
