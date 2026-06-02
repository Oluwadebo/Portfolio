"use client";

import { useSettings } from "@/hooks/useSettings";
import { useEffect, useMemo, useState } from "react";
// import { string } from "zod/v4";

const rolesv = [
  "Full Stack Developer",
  "Next.js Engineer",
  "Node.js Backend Dev",
  "TypeScript Enthusiast",
  "Ai Enthusiast",
];

export default function Hero() {
  const { settings } = useSettings();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  const roles = useMemo(
    () => [settings.role, ...rolesv.filter((r) => r !== settings.role)],
    [settings.role],
  );

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: NodeJS.Timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex, roles]);

  const nameParts = settings.displayName.trim().split(" ");
  const firstName = nameParts[0]?.toUpperCase() || "OGUNWE";
  const lastName = nameParts.slice(1).join(" ").toUpperCase() || "DEBO";

  return (
    // <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(59,130,246,0.1) 0%,transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3B82F6]/20 bg-[#3B82F6]/06 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[.2em] text-[#3B82F6]">
              {settings.available ? "AVAILABLE FOR WORK" : "NOT AVAILABLE"}
            </span>
          </div>

          {/* Name */}
          <h1
            className="font-black leading-[.9] tracking-tight mb-3"
            style={{ fontSize: "clamp(56px,8vw,80px)" }}
          >
            {firstName}
            <br />
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(59,130,246,0.5)",
              }}
            >
              {lastName}
            </span>
          </h1>

          {/* Typewriter */}
          <div className="flex items-center gap-1 mb-5 h-8">
            <span className="font-mono text-[#3B82F6] text-sm">
              {displayed}
            </span>
            <span className="inline-block w-0.5 h-4 bg-[#3B82F6] animate-[blink_1s_step-end_infinite]" />
          </div>

          {/* Bio */}
          <p className="text-[#64748B] text-sm leading-relaxed mb-8 max-w-sm">
            {settings.bio}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="px-6 py-2.5 bg-[#3B82F6] text-white text-sm font-semibold tracking-wide hover:bg-[#2563EB] transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-2.5 border border-white/15 text-white/60 text-sm hover:text-white hover:border-white/30 transition-all tracking-wide"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* RIGHT — Terminal card */}
        <div className="bg-[#0D1220] border border-[#3B82F6]/15 overflow-hidden">
          {/* Terminal bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#111827] border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-2 font-mono text-[11px] text-[#334155]">
              dev.profile
            </span>
          </div>
          {/* Terminal body */}
          <div className="p-5 font-mono text-[12px] leading-[2]">
            <div className="text-[#334155]">{"// ogunwe.config.ts"}</div>
            <div>
              <span className="text-[#7DD3FC]">const</span>{" "}
              <span className="text-white">developer</span> = {"{"}
            </div>
            <div>
              &nbsp;&nbsp;<span className="text-[#7DD3FC]">name</span>:{" "}
              <span className="text-[#86EFAC]">
                &quot;{settings.displayName}&quot;
              </span>
              ,
            </div>
            <div>
              &nbsp;&nbsp;<span className="text-[#7DD3FC]">role</span>:{" "}
              <span className="text-[#86EFAC]">
                &quot;{settings.role}&quot;
              </span>
              ,
            </div>
            <div>
              &nbsp;&nbsp;<span className="text-[#7DD3FC]">stack</span>: [
              <span className="text-[#86EFAC]">&quot;Next.js&quot;</span>,{" "}
              <span className="text-[#86EFAC]">&quot;React.js&quot;</span>,{" "}
              <span className="text-[#86EFAC]">&quot;HTML&quot;</span>,{" "}
              <span className="text-[#86EFAC]">&quot;CSS&quot;</span>,{" "}
              <span className="text-[#86EFAC]">&quot;Bootstrap&quot;</span>,{" "}
              <span className="text-[#86EFAC]">&quot;Javascript&quot;</span>,{" "}
              <span className="text-[#86EFAC]">&quot;Node.js&quot;</span>],
            </div>
            <div>
              &nbsp;&nbsp;<span className="text-[#7DD3FC]">experience</span>:{" "}
              <span className="text-[#FCA5A5]">&quot;Senior&quot;</span>,
            </div>
            <div>
              &nbsp;&nbsp;<span className="text-[#7DD3FC]">available</span>:{" "}
              <span
                className={
                  settings.available ? "text-green-400" : "text-red-400"
                }
              >
                {String(settings.available)}
              </span>
              ,
            </div>
            <div>{"}"}</div>
            <div>&nbsp;</div>
            <div className="text-[#334155]">{"// currently building"}</div>
            <div>
              <span className="text-[#7DD3FC]">export default</span>{" "}
              <span className="text-[#86EFAC]">developer</span>{" "}
              <span className="text-[#3B82F6]">✓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
