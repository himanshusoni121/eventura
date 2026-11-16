"use client";

import { useState, useEffect } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest } from "@/lib/admin-api";
import { siteConfig as staticSiteConfig } from "@/lib/data";
import { Loader2, AlertCircle, Check, Globe, Save, Settings } from "lucide-react";

const SECTION = "site" as const;

interface SiteManifest {
  name?: string;
  tagline?: string;
  description?: string;
  backgroundImage?: string;
  publishedAt?: string;
  updatedAt?: string;
}


export default function SiteAdminPage() {
  const [data, setData] = useState<SiteManifest>({
    name: staticSiteConfig.name,
    tagline: staticSiteConfig.tagline,
    description: staticSiteConfig.description,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getManifest(SECTION, true)
      .then((d) => {
        if (d) setData({ ...data, ...(d as SiteManifest) });
      })
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSave(publish: boolean) {
    if (publish) {
      setPublishing(true);
      const result = await publishManifest(SECTION, data);
      setPublishing(false);
      result.ok
        ? showToast("✓ Published! Site settings updated on live site within 30 seconds.")
        : showToast(result.error ?? "Publish failed", "error");
    } else {
      setSaving(true);
      const result = await saveDraft(SECTION, data);
      setSaving(false);
      result.ok ? showToast("Draft saved") : showToast(result.error ?? "Save failed", "error");
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl ${
          toast.type === "success"
            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            : "bg-red-500/20 border border-red-500/40 text-red-300"
        }`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>
      )}

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-[#8a8a9a] text-sm mt-0.5">
          Edit global site information and branding.
        </p>
      </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 max-w-3xl">
        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Site Name
          </label>
          <input
            type="text"
            value={data.name ?? ""}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Eventura"
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>

        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Tagline
          </label>
          <input
            type="text"
            value={data.tagline ?? ""}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            placeholder="Creating Extraordinary Experiences That Last Forever"
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>

        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Site Description
          </label>
          <textarea
            value={data.description ?? ""}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={4}
            placeholder="Premier Event Management Company & Luxury Wedding Planner in Jodhpur, Rajasthan..."
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
          />
        </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>

        <div className="flex gap-3 pt-4 border-t border-white/8">
          <button
            onClick={() => handleSave(false)}
            disabled={saving || publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={publishing || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publish
          </button>
        </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>

        {data.publishedAt && (
          <p className="text-xs text-[#6a6a7a] pt-2">
            Last published: {new Date(data.publishedAt).toLocaleString("en-IN")}
          </p>
        )}
      </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>

      <div className="mt-6 bg-white/3 border border-white/8 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-[#D4AF37] mb-2">Note</h3>
        <p className="text-xs text-[#8a8a9a]">
          These settings affect the hero section and SEO metadata. Changes appear on the live site within 30 seconds after publishing.
        </p>
      </div>
<div className="mt-4">
  <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">Background Image URL</label>
  <input
    type="text"
    value={data.backgroundImage ?? ""}
    onChange={(e) => setData({ ...data, backgroundImage: e.target.value })}
    placeholder="/images/bg.jpg"
    className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
  />
</div>
    </AdminShell>
  );
}
