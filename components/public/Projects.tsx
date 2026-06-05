"use client";

import BACKEND_URL from "@/lib/api";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  featured: boolean;
}

async function trackClick(id: string, type: "live" | "github") {
  try {
    await fetch(`${BACKEND_URL}/projects/${id}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
  } catch {}
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);

const fetchProjects = async (pageNum: number, append = false) => {
  const limit = pageNum === 1 ? 6 : 3;
  try {
    const r = await fetch(`${BACKEND_URL}/projects?page=${pageNum}&limit=${limit}`);
    const data = await r.json();
      if (append) {
      setProjects((prev) => [...prev, ...data.projects]);
    } else {
      setProjects(data.projects);
    }
    setHasMore(data.hasMore);
  } catch {
    setError(true);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};

useEffect(() => {
  const load = async () => {
    await fetchProjects(1);
  };
  load();
}, []);
// useEffect(() => { fetchProjects(1); }, []);

  // useEffect(() => {
  //   fetch(`${BACKEND_URL}/projects`)
  //     .then((r) => r.json())
  //     .then(setProjects)
  //     .catch(() => setError(true))
  //     .finally(() => setLoading(false));
  // }, []);

  const loadMore = () => {
  const nextPage = page + 1;
  setPage(nextPage);
  setLoadingMore(true);
  fetchProjects(nextPage, true);
};
  return (
    <section
      id="projects"
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
          PROJECTS
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-10">
          Selected Work<span className="text-[#3B82F6]">.</span>
        </h2>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3,4,5,6].map((i) => (
              <div
                key={i}
                className="h-72 bg-[#0D1220] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Network error */}
        {!loading && error && (
          <div className="py-20 border border-dashed border-red-400/20 flex items-center justify-center">
            <p className="font-mono text-[10px] text-red-400/60 tracking-[.2em]">
              FAILED TO LOAD PROJECTS — CHECK CONNECTION
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="py-20 border border-dashed border-white/10 flex items-center justify-center">
            <p className="font-mono text-[10px] text-[#334155] tracking-[.2em]">
              PROJECTS COMING SOON
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group bg-[#0D1220] border border-white/5 overflow-hidden flex flex-col hover:border-[#3B82F6]/30 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-36 bg-[#111827] overflow-hidden flex items-center justify-center">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="font-mono text-[9px] text-[#334155] tracking-[.2em]">
                      NO PREVIEW
                    </span>
                  )}
                  {project.featured && (
                    <span className="absolute top-2 right-2 font-mono text-[9px] px-2 py-1 bg-[#3B82F6] text-white tracking-[.1em]">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-base mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[#64748B] text-xs leading-relaxed mb-3 flex-1">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] px-2 py-0.5 border border-[#3B82F6]/20 text-[#3B82F6]/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick(project._id, "live")}
                        className="flex-1 text-center font-mono text-[10px] py-2 bg-[#3B82F6] text-white tracking-[.1em] hover:bg-[#2563EB] transition-colors"
                      >
                        LIVE SITE
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick(project._id, "github")}
                        className="flex-1 text-center font-mono text-[10px] py-2 border border-white/10 text-white/50 tracking-[.1em] hover:text-white hover:border-white/30 transition-all"
                      >
                        GITHUB
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* loadmore */}
        {hasMore && (
  <div className="flex justify-center mt-8">
    <button
      onClick={loadMore}
      disabled={loadingMore}
      className="font-mono text-[11px] px-8 py-3 border border-[#3B82F6]/40 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all tracking-[.1em] disabled:opacity-50"
    >
      {loadingMore ? "LOADING..." : "LOAD MORE PROJECTS"}
    </button>
  </div>
)}
      </div>
    </section>
  );
}
