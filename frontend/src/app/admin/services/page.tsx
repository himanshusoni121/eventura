"use client";

import { useState, useEffect } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest } from "@/lib/admin-api";
import { services as staticServices } from "@/lib/data";
import { Loader2, AlertCircle, Check, Globe, Save, Briefcase, Plus, Trash2, Pencil, X } from "lucide-react";

const SECTION = "services" as const;

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

interface ServicesManifest {
  items?: ServiceItem[];
  publishedAt?: string;
  updatedAt?: string;
}

export default function ServicesAdminPage() {
  const [items, setItems] = useState<ServiceItem[]>(staticServices);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = (await getManifest(SECTION, true)) as ServicesManifest | null;
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

  function updateItem(index: number, patch: Partial<ServiceItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addNewItem() {
    setItems((prev) => [...prev, { title: "", description: "", icon: "Star" }]);
    setEditingId(items.length);
  }

  function deleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(publish: boolean) {
    if (publish) {
      setPublishing(true);
      const result = await publishManifest(SECTION, { items });
      setPublishing(false);
      result.ok
        ? showToast("✓ Published! Services updated on live site within 30 seconds.")
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
          <h1 className="font-heading text-2xl font-bold text-white">Services</h1>
          <p className="text-[#8a8a9a] text-sm mt-0.5">
            {items.length} service{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addNewItem}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
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

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{item.title || "Untitled Service"}</p>
                <p className="text-[#8a8a9a] text-xs mt-0.5 line-clamp-1">{item.description || "No description"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditingId(editingId === idx ? null : idx)}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all"
                >
                  {editingId === idx ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => deleteItem(idx)}
                  className="w-7 h-7 rounded-lg bg-red-500/15 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {editingId === idx && (
              <div className="border-t border-white/8 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(idx, { title: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                    rows={3}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/25 transition-all w-fit"
                >
                  <Check className="w-3 h-3" /> Done
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
