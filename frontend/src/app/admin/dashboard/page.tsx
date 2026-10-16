"use client";

import { useEffect, useState } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest } from "@/lib/admin-api";
import { portfolioItems, marqueeItemsList, services, stats, testimonials } from "@/lib/data";
import Link from "next/link";
import { Images, GalleryHorizontalEnd, ImageIcon, CheckCircle2, Clock, ArrowRight, FileText, Briefcase, BarChart3, MessageSquare, Phone, Settings } from "lucide-react";

interface SectionStat {
  label: string;
  icon: React.ReactNode;
  href: string;
  staticCount: number;
  publishedCount: number | null;
  lastPublished: string | null;
  color: string;
}

export default function DashboardPage() {
  const [sectionStats, setSectionStats] = useState<SectionStat[]>([
    {
      label: "Portfolio Gallery",
      icon: <Images className="w-5 h-5" />,
      href: "/admin/portfolio",
      staticCount: portfolioItems.length,
      publishedCount: null,
      lastPublished: null,
      color: "#D4AF37",
    },
    {
      label: "Homepage Slider",
      icon: <GalleryHorizontalEnd className="w-5 h-5" />,
      href: "/admin/marquee",
      staticCount: marqueeItemsList.length,
      publishedCount: null,
      lastPublished: null,
      color: "#A78BFA",
    },
    {
      label: "Hero Background",
      icon: <ImageIcon className="w-5 h-5" />,
      href: "/admin/hero",
      staticCount: 1,
      publishedCount: null,
      lastPublished: null,
      color: "#34D399",
    },
    {
      label: "About Section",
      icon: <FileText className="w-5 h-5" />,
      href: "/admin/about",
      staticCount: 1,
      publishedCount: null,
      lastPublished: null,
      color: "#F472B6",
    },
    {
      label: "Services",
      icon: <Briefcase className="w-5 h-5" />,
      href: "/admin/services",
      staticCount: services.length,
      publishedCount: null,
      lastPublished: null,
      color: "#60A5FA",
    },
    {
      label: "Statistics",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/admin/statistics",
      staticCount: stats.length,
      publishedCount: null,
      lastPublished: null,
      color: "#FB923C",
    },
    {
      label: "Testimonials",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/admin/testimonials",
      staticCount: testimonials.length,
      publishedCount: null,
      lastPublished: null,
      color: "#A3E635",
    },
    {
      label: "Contact Info",
      icon: <Phone className="w-5 h-5" />,
      href: "/admin/contact",
      staticCount: 1,
      publishedCount: null,
      lastPublished: null,
      color: "#C084FC",
    },
    {
      label: "Site Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/site",
      staticCount: 1,
      publishedCount: null,
      lastPublished: null,
      color: "#FBBF24",
    },
  ]);

  useEffect(() => {
    async function fetchStats() {
      const sections = ["portfolio", "marquee", "hero", "about", "services", "statistics", "testimonials", "contact", "site"] as const;
      const results = await Promise.all(
        sections.map((s) =>
          getManifest(s, true).then((d) => {
            const data = d as { items?: unknown[]; publishedAt?: string; heroImage?: string; title?: string; phone?: string; name?: string } | null;
            if (!data) return { count: null, publishedAt: null };
            if (s === "hero") {
              return { count: data.heroImage ? 1 : 0, publishedAt: data.publishedAt ?? null };
            }
            if (s === "about" || s === "contact" || s === "site") {
              return { count: (data.title || data.phone || data.name) ? 1 : 0, publishedAt: data.publishedAt ?? null };
            }
            return {
              count: data.items ? data.items.length : null,
              publishedAt: (data as { publishedAt?: string }).publishedAt ?? null,
            };
          })
        )
      );

      setSectionStats((prev) =>
        prev.map((s, i) => ({
          ...s,
          publishedCount: results[i].count,
          lastPublished: results[i].publishedAt,
        }))
      );
    }
    fetchStats();
  }, []);

  function formatDate(iso: string | null) {
    if (!iso) return "Never published";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">
          Dashboard
        </h1>
        <p className="text-[#8a8a9a] text-sm">
          Manage your live website content without rebuilding or redeploying.
        </p>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {sectionStats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-white/8 transition-all duration-300"
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${s.color}20`, color: s.color }}
            >
              {s.icon}
            </div>

            {/* Label */}
            <p className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-1">{s.label}</p>

            {/* Count */}
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-white font-heading">
                {s.publishedCount !== null ? s.publishedCount : s.staticCount}
              </span>
              <span className="text-[#6a6a7a] text-sm mb-1">
                {s.publishedCount !== null ? "published" : "static defaults"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 text-xs text-[#6a6a7a]">
              {s.lastPublished ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {formatDate(s.lastPublished)}
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Using static defaults
                </>
              )}
            </div>

            {/* Arrow */}
            <ArrowRight
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a7a] group-hover:text-white group-hover:translate-x-1 transition-all"
            />
          </Link>
        ))}
      </div>

      {/* Quick tips */}
      <div className="bg-white/3 border border-[#D4AF37]/20 rounded-2xl p-5">
        <h2 className="font-heading font-bold text-white text-base mb-3 flex items-center gap-2">
          <span className="text-[#D4AF37]">✦</span> How publishing works
        </h2>
        <ul className="space-y-2 text-sm text-[#8a8a9a]">
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold shrink-0">1.</span>
            Pick a section from the left menu.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold shrink-0">2.</span>
            Upload images, edit titles/descriptions, reorder them.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold shrink-0">3.</span>
            <span><strong className="text-white">Save Draft</strong> to preview without going live, or <strong className="text-white">Publish</strong> to update the live site immediately.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold shrink-0">4.</span>
            Visitors see the change within 30 seconds (CDN cache TTL).
          </li>
        </ul>
      </div>
    </AdminShell>
  );
}
