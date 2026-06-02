"use client";

import { isLoggedIn, removeToken } from "@/lib/auth";
import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

const navItems = [
  { label: "DASHBOARD", href: "/admin/dashboard", icon: "▤" },
  { label: "PROJECTS", href: "/admin/projects", icon: "◈" },
  { label: "SETTINGS", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const authenticated = isLoginPage || isLoggedIn();

  useEffect(() => {
    if (!isLoginPage && !isLoggedIn()) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, router]);

  if (!authenticated)
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <p className="font-mono text-[10px] text-[#334155] tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );

  if (isLoginPage) return <>{children}</>;

  const handleLogout = () => {
    removeToken();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex">
      {/* Sidebar */}
      <aside className="w-52 bg-[#0D1220] border-r border-white/5 flex flex-col fixed top-0 left-0 bottom-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <p className="font-mono text-[13px] tracking-[.2em] text-[#3B82F6]">
            {settings.siteName}
          </p>
          <p className="font-mono text-[9px] tracking-[.2em] text-[#334155] mt-0.5">
            ADMIN PANEL
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[.15em] transition-all ${
                  active
                    ? "bg-[#3B82F6]/10 text-[#3B82F6] border-l-2 border-[#3B82F6]"
                    : "text-[#64748B] hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[.15em] text-[#64748B] hover:text-white transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> VIEW PUBLIC-SITE
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 font-mono text-[10px] tracking-[.15em] text-[#64748B] hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3 w-3" />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-52 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
