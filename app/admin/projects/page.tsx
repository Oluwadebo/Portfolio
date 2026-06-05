"use client";

import BACKEND_URL from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  title: string;
  tags: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
}
const headers = [
  { label: "PROJECT", span: "col-span-4" },
  { label: "TAGS", span: "col-span-4" },
  { label: "STATUS", span: "col-span-2" },
  { label: "ACTIONS", span: "col-span-2 text-center" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/projects`)
      .then((r) => r.json())
      .then((data) => {
      // Handle both old array response and new paginated response
      const list = Array.isArray(data) ? data : data.projects ?? [];
      setProjects(list);
    })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // schedule fetch in a microtask to avoid synchronous setState inside effect
    Promise.resolve().then(fetchProjects);
  }, []);

  const handleDelete = async (id: string) => {
    // if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`${BACKEND_URL}/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
            ADMIN / PROJECTS
          </p>
          <h1 className="text-2xl font-black tracking-tight">
            Manage Projects
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="font-mono text-[11px] px-5 py-2.5 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors"
        >
          + ADD PROJECT
        </Link>
      </div>

      {/* Table */}
      <div className="bg-[#0D1220] border border-white/5">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5">
          {headers.map(({ label, span }) => (
            <p
              key={label}
              className={`font-mono text-[11px] text-[#334155] tracking-[.2em] ${span}`}
            >
              {label}
            </p>
          ))}
        </div>

        {loading && (
          <div className="p-8 text-center">
            <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">
              LOADING...
            </p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="p-12 text-center border border-dashed border-white/10 m-4">
            <p className="font-mono text-[10px] text-[#334155] tracking-widest mb-4">
              NO PROJECTS YET
            </p>
            <Link
              href="/admin/projects/new"
              className="font-mono text-[10px] text-[#3B82F6] tracking-widest underline"
            >
              ADD YOUR FIRST PROJECT →
            </Link>
          </div>
        )}

        {!loading &&
          projects.map((project) => (
            <div
              key={project._id}
              className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] items-center"
            >
              {/* Title */}
              <div className="col-span-4">
                <p className="text-sm font-medium text-white truncate px-1">
                  {project.title}
                </p>
                <p className="font-mono text-[9px] text-[#334155] mt-0.5">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Tags */}
              <div className="col-span-4 flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] px-2 py-0.5 border border-[#3B82F6]/20 text-[#3B82F6]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div className="col-span-2">
                {project.featured ? (
                  <span className="font-mono text-[9px] px-2 py-1 bg-[#3B82F6]/10 text-[#3B82F6] tracking-widest">
                    FEATURED
                  </span>
                ) : (
                  <span className="font-mono text-[9px] text-[#334155] tracking-widest">
                    NORMAL
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link
                  href={`/admin/projects/${project._id}`}
                  className="font-mono text-[9px] px-3 py-1.5 border border-white/10 text-[#64748B] hover:text-white hover:border-white/30 transition-all tracking-widest"
                >
                  EDIT
                </Link>
                {confirmDelete === project._id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deleting === project._id}
                      className="font-mono text-[9px] px-3 py-1.5 bg-red-500/20 border border-red-400/40 text-red-400 tracking-widest disabled:opacity-30"
                    >
                      {deleting === project._id ? "..." : "YES"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="font-mono text-[9px] px-3 py-1.5 border border-white/10 text-[#64748B] hover:text-white tracking-widest"
                    >
                      NO
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(project._id)}
                    className="font-mono text-[9px] px-3 py-1.5 border border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-all tracking-widest"
                  >
                    DEL
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
