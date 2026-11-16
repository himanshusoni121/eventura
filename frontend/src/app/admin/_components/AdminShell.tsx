"use client";

/**
 * Reusable admin shell used by all dashboard pages.
 * Wraps content with a sidebar (desktop) / top-bar + bottom-nav (mobile).
 * Handles auth guard — redirects to /admin if not logged in.
 */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isLoggedIn, logout } from "@/lib/admin-api";
import {
  LayoutDashboard,
  Images,
  FolderKanban,
  GalleryHorizontalEnd,
  ImageIcon,
  LogOut,
  Menu,
  X,
  FileText,
  Briefcase,
  BarChart3,
  MessageSquare,
  Phone,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "Portfolio", Icon: Images },
  { href: "/admin/categories", label: "Categories", Icon: FolderKanban },
  { href: "/admin/marquee", label: "Slider", Icon: GalleryHorizontalEnd },
  { href: "/admin/hero", label: "Hero Image", Icon: ImageIcon },
  { href: "/admin/about", label: "About", Icon: FileText },
  { href: "/admin/services", label: "Services", Icon: Briefcase },
  { href: "/admin/statistics", label: "Statistics", Icon: BarChart3 },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquare },
  { href: "/admin/contact", label: "Contact", Icon: Phone },
  { href: "/admin/site", label: "Site Settings", Icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/admin");
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0E12] flex">
      {/* ── Sidebar (desktop) ──────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen border-r border-white/8 bg-[#13151B] sticky top-0 h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/images/logo.png" alt="Eventura" fill priority className="object-contain" />
          </div>
          <div>
            <p className="font-heading text-base font-bold text-white leading-tight">Eventura</p>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.18em] font-medium">Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25"
                    : "text-[#b0b0c0] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/8">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#6a6a7a] hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-white/5 mb-1"
          >
            <span>↗</span> View live site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#6a6a7a] hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile sidebar drawer ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#13151B] border-r border-white/8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7">
                  <Image src="/images/logo.png" alt="Eventura" fill priority className="object-contain" />
                </div>
                <span className="font-heading text-white font-bold text-base">Eventura</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-[#6a6a7a] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV.map(({ href, label, Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25"
                        : "text-[#b0b0c0] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-white/8">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400/80 hover:text-red-400 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top-bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0e0e14] sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#b0b0c0] hover:text-white p-1"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image src="/images/logo.png" alt="Eventura" fill priority className="object-contain" />
            </div>
            <span className="font-heading text-white font-bold text-sm">Admin</span>
          </div>
          <Link href="/" className="text-[#6a6a7a] hover:text-[#D4AF37] text-xs transition-colors">
            Site ↗
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
