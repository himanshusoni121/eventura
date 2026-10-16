"use client";

import { useState, useEffect } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest } from "@/lib/admin-api";
import { Loader2, AlertCircle, Check, Globe, Save, FileText } from "lucide-react";

const SECTION = "about" as const;

interface AboutManifest {
  title?: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutManifest>({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getManifest(SECTION, true)
      .then((d) => {
        if (d) setData(d as AboutManifest);
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
        ? showToast("✓ Published! About section updated on live site within 30 seconds.")
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
      )}

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">About Section</h1>
        <p className="text-[#8a8a9a] text-sm mt-0.5">
          Edit the About section content displayed on the website.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 max-w-3xl">
        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Section Title
          </label>
          <input
            type="text"
            value={data.title ?? ""}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="About Us"
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Description
          </label>
          <textarea
            value={data.description ?? ""}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={6}
            placeholder="About Eventura..."
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
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

        {data.publishedAt && (
          <p className="text-xs text-[#6a6a7a] pt-2">
            Last published: {new Date(data.publishedAt).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </AdminShell>
  );
}
