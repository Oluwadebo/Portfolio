"use client";

import BACKEND_URL from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import { useEffect, useState } from "react";

interface SettingsForm {
  siteName: string;
  displayName: string;
  role: string;
  bio: string;
  available: boolean;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

const defaultForm: SettingsForm = {
  siteName: "",
  displayName: "",
  role: "",
  bio: "",
  available: true,
  email: "",
  github: "",
  linkedin: "",
  twitter: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/settings`)
      .then((r) => r.json())
      .then((data) => setForm({ ...defaultForm, ...data }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch(`${BACKEND_URL}/settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Failed to save settings");
        return;
      }

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">
          LOADING SETTINGS...
        </p>
      </div>
    );

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
          ADMIN / SETTINGS
        </p>
        <h1 className="text-2xl font-black tracking-tight">Site Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Identity */}
        <div className="bg-[#0D1220] border border-white/5 p-5 space-y-4">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em]">
            IDENTITY
          </p>

          <Field label="SITE NAME">
            <input
              type="text"
              value={form.siteName}
              onChange={(e) =>
                setForm((f) => ({ ...f, siteName: e.target.value }))
              }
              placeholder="OD.DEV"
              className={inputClass}
            />
          </Field>

          <Field label="DISPLAY NAME">
            <input
              type="text"
              value={form.displayName}
              onChange={(e) =>
                setForm((f) => ({ ...f, displayName: e.target.value }))
              }
              placeholder="Ogunwe Debo"
              className={inputClass}
            />
          </Field>

          <Field label="ROLE">
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="Full Stack Developer"
              className={inputClass}
            />
          </Field>

          <Field label="BIO">
            <textarea
              value={form.bio}
              rows={3}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="I build fast, scalable..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          {/* Available toggle */}
          <Field label="AVAILABILITY">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, available: !f.available }))
                }
                className={`w-10 h-5 transition-colors relative ${form.available ? "bg-green-500" : "bg-[#1E293B]"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${form.available ? "left-5" : "left-0.5"}`}
                />
              </button>
              <span
                className={`font-mono text-[10px] tracking-widest ${form.available ? "text-green-400" : "text-[#64748B]"}`}
              >
                {form.available ? "AVAILABLE FOR WORK" : "NOT AVAILABLE"}
              </span>
            </div>
          </Field>
        </div>

        {/* Contact */}
        <div className="bg-[#0D1220] border border-white/5 p-5 space-y-4">
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em]">
            CONTACT & SOCIALS
          </p>

          <Field label="EMAIL">
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@email.com"
              className={inputClass}
            />
          </Field>

          <Field label="GITHUB URL">
            <input
              type="url"
              value={form.github}
              onChange={(e) =>
                setForm((f) => ({ ...f, github: e.target.value }))
              }
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </Field>

          <Field label="LINKEDIN URL">
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) =>
                setForm((f) => ({ ...f, linkedin: e.target.value }))
              }
              placeholder="https://linkedin.com/in/..."
              className={inputClass}
            />
          </Field>

          <Field label="TWITTER URL">
            <input
              type="url"
              value={form.twitter}
              onChange={(e) =>
                setForm((f) => ({ ...f, twitter: e.target.value }))
              }
              placeholder="https://twitter.com/..."
              className={inputClass}
            />
          </Field>
        </div>

        {/* Feedback */}
        {error && (
          <p className="font-mono text-[10px] text-red-400 tracking-widest border border-red-400/20 bg-red-400/5 px-3 py-2">
            ✗ {error.toUpperCase()}
          </p>
        )}
        {success && (
          <p className="font-mono text-[10px] text-green-400 tracking-widest border border-green-400/20 bg-green-400/5 px-3 py-2">
            ✓ {success.toUpperCase()}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="font-mono text-[11px] px-6 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors disabled:opacity-50"
        >
          {saving ? "SAVING..." : "SAVE SETTINGS"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-[#334155] font-mono";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] text-[#64748B] tracking-[.2em] block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
