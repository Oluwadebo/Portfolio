"use client";

import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

export default function Contact() {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(settings.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const socials = [
    { label: "GITHUB", url: settings.github },
    { label: "LINKEDIN", url: settings.linkedin },
    { label: "TWITTER", url: settings.twitter },
  ].filter((s) => s.url);

  return (
    <section
      id="contact"
      className="w-full flex justify-center py-24 px-6 relative"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(59,130,246,0.3),transparent)",
        }}
      />
      <div className="w-full max-w-5xl">
        <p className="font-mono text-[10px] tracking-[.25em] text-[#3B82F6] mb-3">
          CONTACT
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-10">
          Let&apos;s Work Together<span className="text-[#3B82F6]">.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <div>
            <p className="text-[#64748B] text-sm leading-relaxed mb-6">
              {settings.available
                ? "I'm currently open to new opportunities — freelance projects, full-time roles, part-time roles, or interesting collaborations. If you have something in mind, let's talk."
                : "I'm currently not available for new work. Feel free to reach out anyway — I'm always happy to connect and discuss future opportunities."}
            </p>

            {/* Email copy */}
            {settings.email && (
              <button
                onClick={copyEmail}
                className="w-full flex items-center justify-between p-4 border border-white/8 hover:border-[#3B82F6]/40 transition-all text-left mb-4 group"
              >
                <div>
                  <p className="font-mono text-[9px] text-[#64748B] tracking-[.2em] mb-1">
                    EMAIL
                  </p>
                  <p className="text-sm text-white">{settings.email}</p>
                </div>
                <span className="font-mono text-[10px] text-[#3B82F6] tracking-[.1em]">
                  {copied ? "COPIED!" : "COPY"}
                </span>
              </button>
            )}

            {/* Socials */}
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(({ label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] px-4 py-2 border border-white/8 text-[#64748B] hover:text-white hover:border-white/30 transition-all tracking-[.15em]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right CTA */}
          <div className="bg-[#0D1220] border border-white/5 p-7 relative overflow-hidden">
            <div
              className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-2xl pointer-events-none"
              style={{ background: "rgba(59,130,246,0.08)" }}
            />
            <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-3">
              READY TO BUILD?
            </p>
            <h3 className="text-xl font-black mb-3 tracking-tight">
              Have a project in mind?
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-6">
              Whether it&apos;s a startup MVP, a logistics platform, a laundry
              management system, or a full SaaS product — I&apos;ve built them,
              and I&apos;d love to hear about yours.
            </p>
            <a
              href={`mailto:${settings.email}`}
              className="inline-block px-6 py-2.5 bg-[#3B82F6] text-white text-sm font-semibold tracking-wide hover:bg-[#2563EB] transition-colors"
            >
              Send Me An Email →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
