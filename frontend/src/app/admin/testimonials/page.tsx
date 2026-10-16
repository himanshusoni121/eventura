"use client";

import { useState, useEffect, useRef } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest } from "@/lib/admin-api";
import { testimonials as staticTestimonials } from "@/lib/data";
import { Loader2, AlertCircle, Check, Globe, Save, MessageSquare, Plus, Trash2, Pencil, X } from "lucide-react";

const SECTION = "testimonials" as const;

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

interface TestimonialsManifest {
  items?: TestimonialItem[];
  publishedAt?: string;
  updatedAt?: string;
}

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<TestimonialItem[]>(staticTestimonials);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const nextId = useRef(100);

  useEffect(() => {
    async function load() {
      try {
        const data = (await getManifest(SECTION, true)) as TestimonialsManifest | null;
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          nextId.current = Math.max(...data.items.map((i) => i.id)) + 1;
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

  function updateItem(id: number, patch: Partial<TestimonialItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addNewItem() {
    const newId = nextId.current++;
    setItems((prev) => [...prev, { id: newId, name: "", role: "", quote: "", rating: 5, image: "" }]);
    setEditingId(newId);
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSave(publish: boolean) {
    if (publish) {
      setPublishing(true);
      const result = await publishManifest(SECTION, { items });
      setPublishing(false);
      result.ok
        ? showToast("✓ Published! Testimonials updated on live site within 30 seconds.")
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
          <h1 className="font-heading text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-[#8a8a9a] text-sm mt-0.5">
            {items.length} testimonial{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addNewItem}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
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
        {items.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{item.name || "Unnamed"}</p>
                <p className="text-[#8a8a9a] text-xs mt-0.5">{item.role || "No role"}</p>
                <p className="text-[#6a6a7a] text-xs mt-1 line-clamp-1">{item.quote || "No quote"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all"
                >
                  {editingId === item.id ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="w-7 h-7 rounded-lg bg-red-500/15 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {editingId === item.id && (
              <div className="border-t border-white/8 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Role</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateItem(item.id, { role: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Quote</label>
                  <textarea
                    value={item.quote}
                    onChange={(e) => updateItem(item.id, { quote: e.target.value })}
                    rows={3}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={item.rating}
                    onChange={(e) => updateItem(item.id, { rating: parseInt(e.target.value) || 5 })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
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
