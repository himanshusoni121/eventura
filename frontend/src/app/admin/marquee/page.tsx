"use client";

import { useState, useEffect, useRef } from "react";
import AdminShell from "../_components/AdminShell";
import {
  getManifest,
  saveDraft,
  publishManifest,
  uploadImage,
  deleteImage,
} from "@/lib/admin-api";
import { marqueeItemsList } from "@/lib/data";
import Image from "next/image";
import {
  Upload, Trash2, ChevronUp, ChevronDown,
  Loader2, AlertCircle, Check, Globe, Save, Pencil, X, Plus,
} from "lucide-react";

const SECTION = "marquee" as const;

const CATEGORIES = [
  "Weddings", "Corporate", "Birthdays", "Cultural", "Reception",
  "Mehndi", "Baraat", "Other",
];

interface MarqueeItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  _uploading?: boolean;
  _uploadProgress?: number;
  _isNew?: boolean;
}

export default function MarqueeAdminPage() {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2000);

  useEffect(() => {
    async function load() {
      try {
        const data = (await getManifest(SECTION, true)) as { items?: MarqueeItem[] } | null;
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          nextId.current = Math.max(...data.items.map((i) => i.id)) + 1;
        } else {
          setItems(marqueeItemsList.map((i) => ({ ...i })));
          nextId.current = Math.max(...marqueeItemsList.map((i) => i.id)) + 1;
        }
      } catch {
        setItems(marqueeItemsList.map((i) => ({ ...i })));
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

  async function handleFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      const tempId = nextId.current++;
      const preview = URL.createObjectURL(file);
      const newItem: MarqueeItem = {
        id: tempId,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        category: "Weddings",
        image: preview,
        description: "",
        _uploading: true,
        _uploadProgress: 0,
        _isNew: true,
      };
      setItems((prev) => [...prev, newItem]);

      const result = await uploadImage(file, SECTION, (pct) =>
        setItems((prev) =>
          prev.map((i) => (i.id === tempId ? { ...i, _uploadProgress: pct } : i))
        )
      );

      if (result.ok && result.url) {
        URL.revokeObjectURL(preview);
        setItems((prev) =>
          prev.map((i) =>
            i.id === tempId ? { ...i, image: result.url!, _uploading: false, _uploadProgress: undefined } : i
          )
        );
      } else {
        showToast(`Upload failed: ${result.error}`, "error");
        setItems((prev) => prev.filter((i) => i.id !== tempId));
      }
    }
  }

  function updateItem(id: number, patch: Partial<MarqueeItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function moveItem(id: number, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }

  async function handleDelete(id: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.image.startsWith("/api/image")) {
      const key = new URL(item.image, "https://x").searchParams.get("key");
      if (key) await deleteImage(key);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setConfirmDelete(null);
    showToast("Image deleted");
  }

  async function handleSaveDraft() {
    setSaving(true);
    const clean = items.map(({ _uploading, _uploadProgress, _isNew, ...rest }) => rest);
    const result = await saveDraft(SECTION, { items: clean });
    setSaving(false);
    result.ok ? showToast("Draft saved") : showToast(result.error ?? "Save failed", "error");
  }

  async function handlePublish() {
    setPublishing(true);
    const clean = items.map(({ _uploading, _uploadProgress, _isNew, ...rest }) => rest);
    const result = await publishManifest(SECTION, { items: clean });
    setPublishing(false);
    result.ok
      ? showToast("✓ Published! Homepage slider updated within 30 seconds.")
      : showToast(result.error ?? "Publish failed", "error");
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
          <h1 className="font-heading text-2xl font-bold text-white">Homepage Slider</h1>
          <p className="text-[#8a8a9a] text-sm mt-0.5">
            {items.length} image{items.length !== 1 ? "s" : ""} · continuously scrolling marquee
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${
          isDraggingOver
            ? "border-[#D4AF37] bg-[#D4AF37]/10"
            : "border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/3"
        }`}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { if (e.target.files?.length) { handleFiles(e.target.files); e.target.value = ""; } }} />
        <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
        <p className="text-white font-medium text-sm mb-1">
          Drop images here or <span className="text-[#D4AF37]">click to browse</span>
        </p>
        <p className="text-[#6a6a7a] text-xs">JPEG · PNG · WebP · Max 8 MB each</p>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-white/5">
                {item._uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                  </div>
                ) : (
                  <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <span className="inline-block text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full mt-1">{item.category}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all">
                  {editingId === item.id ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all disabled:opacity-30">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => moveItem(item.id, 1)} disabled={idx === items.length - 1}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all disabled:opacity-30">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setConfirmDelete(item.id)}
                  className="w-7 h-7 rounded-lg bg-red-500/15 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {editingId === item.id && (
              <div className="border-t border-white/8 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Title</label>
                  <input type="text" value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all" />
                </div>
                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Category</label>
                  <select value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    className="w-full bg-[#141420] border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Description</label>
                  <textarea value={item.description} rows={2}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none" />
                </div>
                <button onClick={() => setEditingId(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/25 transition-all w-fit">
                  <Check className="w-3 h-3" /> Done
                </button>
              </div>
            )}

            {confirmDelete === item.id && (
              <div className="border-t border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-3">
                <p className="text-red-300 text-sm">Delete permanently?</p>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1.5 rounded-lg border border-white/15 text-[#b0b0c0] text-xs hover:text-white transition-all">Cancel</button>
                  <button onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 text-[#6a6a7a]">
            <Plus className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No images yet. Upload some above!</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
