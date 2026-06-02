"use client";

import { authHeaders } from "@/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BACKEND_URL from "@/lib/api";

interface FormData {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
  tags: string;
  featured: boolean;
  order: number;
}

const defaultForm: FormData = {
  title: "",
  description: "",
  image: "",
  liveUrl: "",
  githubUrl: "",
  tags: "",
  featured: false,
  order: 0,
};

export default function ProjectForm() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params?.id && params.id !== "new";

  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  // Load existing project if editing
  useEffect(() => {
    if (!isEdit) return;

    const loadProject = async () => {
      setFetching(true);
      try {
        const res = await fetch(`${BACKEND_URL}/projects`);
        const projects = await res.json();
        const project = projects.find((p: any) => p._id === params.id);
        if (project) {
          setForm({
            title: project.title || "",
            description: project.description || "",
            image: project.image || "",
            liveUrl: project.liveUrl || "",
            githubUrl: project.githubUrl || "",
            tags: (project.tags || []).join(", "),
            featured: project.featured || false,
            order: project.order || 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    loadProject();
  }, [isEdit, params?.id]);

  // Auto-fetch preview when live URL is pasted
  const fetchPreview = async () => {
    if (!form.liveUrl) return;
    setPreviewLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/view`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ url: form.liveUrl }),
      });
      const data = await res.json();
      if (data.image) setForm((f) => ({ ...f, image: data.image }));
      if (data.title && !form.title)
        setForm((f) => ({ ...f, title: data.title }));
      if (data.description && !form.description)
        setForm((f) => ({ ...f, description: data.description }));
    } catch {
      setError("Could not fetch preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const fetchGitHubPreview = async () => {
    if (!form.githubUrl) return;
    setPreviewLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/view`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ url: form.githubUrl }),
      });
      const data = await res.json();
      console.log(data);

      // ── Batch all updates in one setForm ──
      const updatedForm = { ...form };
      if (data.title) updatedForm.title = data.title;
      if (data.description) updatedForm.description = data.description;
      if (data.tags?.length) updatedForm.tags = data.tags.join(", ");
      if (data.liveUrl) updatedForm.liveUrl = data.liveUrl;
      if (data.image) updatedForm.image = data.image;
      setForm(updatedForm);

      // ── If no image but liveUrl exists, fetch image from live site ──
      if (!data.image && data.liveUrl) {
        const imgRes = await fetch(`${BACKEND_URL}/view`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ url: data.liveUrl }),
        });
        const imgData = await imgRes.json();
        if (imgData.image) {
          setForm((f) => ({ ...f, image: imgData.image }));
        }
      }
    } catch {
      setError("Could not fetch GitHub info");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const body = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = isEdit
        ? `${BACKEND_URL}/projects/${params.id}`
        : `${BACKEND_URL}/projects`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      setSuccess(isEdit ? "Project updated!" : "Project created!");
      setTimeout(() => router.push("/admin/projects"), 1000);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">
          LOADING PROJECT...
        </p>
      </div>
    );

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
          ADMIN / PROJECTS / {isEdit ? "EDIT" : "NEW"}
        </p>
        <h1 className="text-2xl font-black tracking-tight">
          {isEdit ? "Edit Project" : "Add New Project"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Live URL + fetch preview */}
        <div className="bg-[#0D1220] border border-[#3B82F6]/20 p-5">
          <label className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] block mb-2">
            LIVE URL — PASTE TO AUTO-FETCH PREVIEW
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.liveUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, liveUrl: e.target.value }))
              }
              placeholder="https://yourproject.com"
              className="flex-1 bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-[#334155] font-mono"
            />
            <button
              type="button"
              onClick={fetchPreview}
              disabled={previewLoading || !form.liveUrl}
              className="font-mono text-[10px] px-4 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {previewLoading ? "FETCHING..." : "FETCH PREVIEW"}
            </button>
          </div>

          {/* Preview image result */}
          {form.image && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={form.image}
                alt="preview"
                className="w-16 h-10 object-cover border border-white/10"
              />
              <p className="font-mono text-[9px] text-green-400 tracking-widest">
                ✓ PREVIEW FETCHED
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <Field label="TITLE" required>
          <input
            type="text"
            value={form.title}
            required
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Project name"
            className={inputClass}
          />
        </Field>

        {/* Description */}
        <Field label="DESCRIPTION" required>
          <textarea
            value={form.description}
            required
            rows={3}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="What does this project do?"
            className={`${inputClass} resize-none`}
          />
        </Field>

        {/* Image URL (manual override) */}
        {/* <Field label="IMAGE URL (MANUAL OVERRIDE)">
          <input
            type="url"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="https://..."
            className={inputClass}
          />
        </Field> */}
        <Field label="IMAGE URL (MANUAL OVERRIDE)">
          <div className="flex gap-2 items-center">
            <input
              type="url"
              value={form.image}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
              placeholder="https://..."
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(form.image);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              disabled={!form.image}
              title="Copy image URL"
              className={`font-mono text-[10px] px-3 py-2.5 border transition-all disabled:opacity-30 whitespace-nowrap ${
                copied
                  ? "border-green-400/40 text-green-400"
                  : "border-white/10 text-[#64748B] hover:text-white hover:border-white/30"
              }`}
            >
              {copied ? "✓ COPIED" : "⎘ COPY"}
            </button>
          </div>
        </Field>

        {/* GitHub URL */}
        {/* <Field label="GITHUB URL">
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, githubUrl: e.target.value }))
            }
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </Field> */}
        <Field label="GITHUB URL">
          <div className="flex gap-2">
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, githubUrl: e.target.value }))
              }
              placeholder="https://github.com/you/repo"
              className={`${inputClass} flex-1`}
            />
            {/* <button
              type="button"
              onClick={fetchGitHubPreview}
              disabled={previewLoading || !form.githubUrl}
              className="font-mono text-[10px] px-4 py-2.5 bg-[#1E293B] border border-white/10 text-[#64748B] hover:text-white tracking-[.1em] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {previewLoading ? "FETCHING..." : "FETCH INFO"}
            </button> */}
            <button
              type="button"
              onClick={fetchGitHubPreview}
              disabled={previewLoading || !form.githubUrl}
              className="font-mono text-[10px] px-4 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {previewLoading ? "FETCHING..." : "FETCH INFO"}
            </button>
          </div>
        </Field>

        {/* Tags */}
        <Field label="TAGS (COMMA SEPARATED)">
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="Next.js, TypeScript, MongoDB"
            className={inputClass}
          />
        </Field>

        {/* Order + Featured */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="ORDER">
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({ ...f, order: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </Field>
          <Field label="FEATURED">
            <div className="flex items-center gap-3 h-10">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, featured: !f.featured }))
                }
                className={`w-10 h-5 transition-colors relative ${form.featured ? "bg-[#3B82F6]" : "bg-[#1E293B]"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${form.featured ? "left-5" : "left-0.5"}`}
                />
              </button>
              <span className="font-mono text-[10px] text-[#64748B] tracking-widest">
                {form.featured ? "YES" : "NO"}
              </span>
            </div>
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="font-mono text-[11px] px-6 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors disabled:opacity-50"
          >
            {loading
              ? "SAVING..."
              : isEdit
                ? "UPDATE PROJECT"
                : "CREATE PROJECT"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="font-mono text-[11px] px-6 py-2.5 border border-white/10 text-[#64748B] hover:text-white tracking-[.1em] transition-colors"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-[#334155] font-mono";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] text-[#64748B] tracking-[.2em] block mb-2">
        {label}
        {required && <span className="text-[#3B82F6] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
