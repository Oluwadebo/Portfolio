"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

const links = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080C14]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex items-center justify-between px-8 h-14">
        <a
          href="#"
          className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6]"
        >
          {settings.siteName}
        </a>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] text-[#64748B] hover:text-white transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-mono text-[12px] px-4 py-1.5 border border-[#3B82F6]/40 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all tracking-[.1em]"
          >
            HIRE ME
          </a>
        </div>
      </div>
    </nav>
  );
}
