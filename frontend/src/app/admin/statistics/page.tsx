"use client";

import { useState, useEffect } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest } from "@/lib/admin-api";
import { stats as staticStats } from "@/lib/data";
import { Loader2, AlertCircle, Check, Globe, Save, BarChart3 } from "lucide-react";

const SECTION = "statistics" as const;

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

interface StatisticsManifest {
  items?: StatItem[];
  publishedAt?: string;
  updatedAt?: string;
}

export default function StatisticsAdminPage() {
  const [items, setItems] = useState<StatItem[]>(staticStats);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = (await getManifest(SECTION, true)) as StatisticsManifest | null;
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      } catch {
        // Keep static fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function updateItem(index: number, patch: Partial<StatItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function handleSave(publish: boolean) {
    if (publish) {
      setPublishing(true);
      const result = await publishManifest(SECTION, { items });
      setPublishing(false);
      result.ok
        ? showToast("✓ Published! Statistics updated on live site within 30 seconds.")
        : showToast(result.error ?? "Publish failed", "error");
    } else {
      setSaving(true);
      const result = await saveDraft(SECTION, { items });
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Statistics</h1>
          <p className="text-[#8a8a9a] text-sm mt-0.5">
            Edit the numbers displayed in the Statistics section.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              Label
            </label>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(idx, { label: e.target.value })}
              className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all mb-3"
            />
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              Value
            </label>
            <input
              type="number"
              value={item.value}
              onChange={(e) => updateItem(idx, { value: parseInt(e.target.value) || 0 })}
              className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all mb-3"
            />
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              Suffix
            </label>
            <input
              type="text"
              value={item.suffix}
              onChange={(e) => updateItem(idx, { suffix: e.target.value })}
              placeholder="+"
              className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
