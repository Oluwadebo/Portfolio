"use client";

import Contact from "@/components/public/Contact";
import Hero from "@/components/public/Hero";
import Navbar from "@/components/public/Navbar";
import Projects from "@/components/public/Projects";
import Skills from "@/components/public/Skills";
import { useSettings } from "@/hooks/useSettings";

export default function Home() {
  const { settings } = useSettings();
  return (
    <main className="bg-[#080C14] min-h-screen w-full text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
      <Skills />
      <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
      <Projects />
      <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent" />
      <Contact />

      {/* <footer className="text-center py-8 text-[#3B82F6]/40 text-sm font-mono tracking-widest border-t border-white/5"> */}
      <footer className="text-center py-6 font-mono text-[11px] tracking-[.2em] text-[#3B82F6]/30 border-t border-white/5">
        © {new Date().getFullYear()} {settings.displayName.toUpperCase()} —
        BUILT WITH NEXT.JS
      </footer>
    </main>
  );
}
