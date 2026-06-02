"use client";

import { useEffect, useState } from "react";
import { authHeaders } from "@/lib/auth";
import BACKEND_URL from "@/lib/api";

interface Analytics {
  totalVisits: number;
  recentVisits: number;
  dailyVisits: { _id: string; count: number }[];
  projects: {
    _id: string;
    title: string;
    clicks: { live: number; github: number };
  }[];
}

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/analytics`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxVisits = data
    ? Math.max(...data.dailyVisits.map((d) => d.count), 1)
    : 1;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-1">
          ADMIN / DASHBOARD
        </p>
        <h1 className="text-2xl font-black tracking-tight">
          Analytics Overview
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-[#0D1220] border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="TOTAL VISITS" value={data?.totalVisits ?? 0} />
            <StatCard label="LAST 30 DAYS" value={data?.recentVisits ?? 0} />
            <StatCard
              label="TOTAL PROJECTS"
              value={data?.projects?.length ?? 0}
            />
          </div>

          {/* Daily visits chart */}
          <div className="bg-[#0D1220] border border-white/5 p-6 mb-6">
            <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-6">
              DAILY VISITS — LAST 30 DAYS
            </p>
            {data?.dailyVisits && data.dailyVisits.length > 0 ? (
              <div className="flex items-end gap-1 h-32">
                {data.dailyVisits.map((day) => (
                  <div
                    key={day._id}
                    className="flex-1 flex flex-col items-center gap-1 group relative"
                  >
                    <div
                      className="w-full bg-[#3B82F6]/20 hover:bg-[#3B82F6]/60 transition-colors relative"
                      style={{
                        height: `${(day.count / maxVisits) * 100}%`,
                        minHeight: "4px",
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white bg-[#111827] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center border border-dashed border-white/10">
                <p className="font-mono text-[10px] text-[#334155] tracking-widest">
                  NO DATA YET
                </p>
              </div>
            )}
          </div>

          {/* Project clicks */}
          <div className="bg-[#0D1220] border border-white/5 p-6">
            <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-6">
              PROJECT LINK CLICKS
            </p>
            {data?.projects && data.projects.length > 0 ? (
              <div className="space-y-3">
                {data.projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <p className="text-sm text-[#94A3B8] truncate max-w-xs">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-mono text-[9px] text-[#334155] tracking-widest">
                          LIVE
                        </p>
                        <p className="font-mono text-sm text-[#3B82F6]">
                          {project.clicks?.live ?? 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] text-[#334155] tracking-widest">
                          GITHUB
                        </p>
                        <p className="font-mono text-sm text-[#64748B]">
                          {project.clicks?.github ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-[10px] text-[#334155] tracking-widest">
                NO PROJECTS YET
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#0D1220] border border-white/5 p-5">
      <p className="font-mono text-[9px] text-[#334155] tracking-[.2em] mb-2">
        {label}
      </p>
      <p className="text-3xl font-black text-white">{value.toLocaleString()}</p>
    </div>
  );
}
