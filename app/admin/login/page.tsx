"use client";

import { isLoggedIn, setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import BACKEND_URL from "@/lib/api";

export default function AdminLogin() {
  const { settings } = useSettings();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/admin/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setToken(data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-6">
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6] mb-1">
            {settings.siteName}
          </p>
          <p className="font-mono text-[10px] tracking-[.2em] text-[#334155]">
            ADMIN ACCESS ONLY
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1220] border border-white/5 p-8">
          {/* Terminal bar */}
          <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
            <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
            <div className="w-2 h-2 rounded-full bg-[#28C840]" />
            <span className="ml-2 font-mono text-[10px] text-[#334155] tracking-widest">
              admin.login
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] block mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
                className="w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-[#334155] font-mono"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] block mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#111827] border border-white/5 text-white text-sm px-4 py-2.5 pr-10 outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-[#334155] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#334155] hover:text-[#64748B] transition-colors"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="font-mono text-[10px] text-red-400 tracking-widest border border-red-400/20 bg-red-400/5 px-3 py-2">
                ✗ {error.toUpperCase()}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#3B82F6] text-white font-mono text-[11px] tracking-[.2em] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "AUTHENTICATING..." : "LOGIN →"}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[10px] text-[#1E3A5F] tracking-widest mt-6">
          THIS PAGE IS NOT PUBLICLY ACCESSIBLE
        </p>
      </div>
    </div>
  );
}
