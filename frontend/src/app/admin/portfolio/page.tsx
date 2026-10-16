"use client";

import { useState, useEffect, useRef } from "react";
import AdminShell from "../_components/AdminShell";
import {
  getManifest,
  saveDraft,
  publishManifest,
  uploadImage,
  deleteImage,
  type Section,
} from "@/lib/admin-api";
import {
  portfolioItems as staticItems,
  portfolioCategories,
  type PortfolioItem,
  type PortfolioCategory,
} from "@/lib/data";
import Image from "next/image";
import {
  Upload,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Star,
  Loader2,
  AlertCircle,
  Plus,
  Save,
  Globe,
  X,
  Pencil,
  ImageUp,
} from "lucide-react";

type DraftItem = PortfolioItem & {
  _uploading?: boolean;
  _uploadProgress?: number;
  _isNew?: boolean;
};

const SECTION: Section = "portfolio";

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1000);

  // ── Load draft manifest ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const data = (await getManifest(SECTION, true)) as {
          items?: DraftItem[];
        } | null;
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          nextId.current = Math.max(...data.items.map((i) => i.id)) + 1;
        } else {
          setItems(staticItems.map((i) => ({ ...i })));
          nextId.current = Math.max(...staticItems.map((i) => i.id)) + 1;
        }
      } catch {
        setItems(staticItems.map((i) => ({ ...i })));
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

  // ── File handling ────────────────────────────────────────────────────────

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    for (const file of arr) {
      const tempId = nextId.current++;
      const preview = URL.createObjectURL(file);

      const newItem: DraftItem = {
        id: tempId,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        category: "destination",
        image: preview,
        description: "",
        _uploading: true,
        _uploadProgress: 0,
        _isNew: true,
      };
      setItems((prev) => [...prev, newItem]);

      const result = await uploadImage(file, SECTION, (pct) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === tempId ? { ...item, _uploadProgress: pct } : item
          )
        );
      });

      if (result.ok && result.url) {
        URL.revokeObjectURL(preview);
        setItems((prev) =>
          prev.map((item) =>
            item.id === tempId
              ? { ...item, image: result.url!, _uploading: false, _uploadProgress: undefined }
              : item
          )
        );
      } else {
        showToast(`Failed to upload ${file.name}: ${result.error}`, "error");
        setItems((prev) => prev.filter((item) => item.id !== tempId));
      }
    }
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  // ── Item operations ──────────────────────────────────────────────────────

  function updateItem(id: number, patch: Partial<DraftItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
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

    // If stored in R2, delete from there too
    if (item.image.startsWith("/api/image")) {
      const key = new URL(item.image, "https://x").searchParams.get("key");
      if (key) await deleteImage(key);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setConfirmDelete(null);
    showToast("Image deleted");
  }

  // ── Save / Publish ───────────────────────────────────────────────────────

  async function handleSaveDraft() {
    setSaving(true);
    const clean = items.map(({ _uploading, _uploadProgress, _isNew, ...rest }) => rest);
    const result = await saveDraft(SECTION, { items: clean });
    setSaving(false);
    if (result.ok) {
      showToast("Draft saved — not yet visible to visitors");
    } else {
      showToast(result.error ?? "Save failed", "error");
    }
  }

  async function handlePublish() {
    setPublishing(true);
    const clean = items.map(({ _uploading, _uploadProgress, _isNew, ...rest }) => rest);
    const result = await publishManifest(SECTION, { items: clean });
    setPublishing(false);
    if (result.ok) {
      showToast("✓ Published! Live site updated within 30 seconds.");
    } else {
      showToast(result.error ?? "Publish failed", "error");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

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
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-red-500/20 border border-red-500/40 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Portfolio Gallery</h1>
          <p className="text-[#8a8a9a] text-sm mt-0.5">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="portfolio-save-draft-btn"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            id="portfolio-publish-btn"
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
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
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${
          isDraggingOver
            ? "border-[#D4AF37] bg-[#D4AF37]/10"
            : "border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/3"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileInputChange}
        />
        <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
        <p className="text-white font-medium text-sm mb-1">
          Drop images here or <span className="text-[#D4AF37]">click to browse</span>
        </p>
        <p className="text-[#6a6a7a] text-xs">JPEG · PNG · WebP · Max 8 MB each</p>
      </div>

      {/* Items list */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-start gap-4 p-4">
              {/* Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-white/5">
                {item._uploading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                    <span className="text-[10px] text-[#D4AF37]">{item._uploadProgress ?? 0}%</span>
                  </div>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                {item._isNew && !item._uploading && (
                  <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{item.title}</p>
                <p className="text-[#8a8a9a] text-xs mt-0.5 capitalize">{item.category}</p>
                <p className="text-[#6a6a7a] text-xs mt-1 line-clamp-1">{item.description || "No description"}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all"
                  title="Edit"
                >
                  {editingId === item.id ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => moveItem(item.id, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveItem(item.id, 1)}
                  disabled={idx === items.length - 1}
                  className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  className="w-7 h-7 rounded-lg bg-red-500/15 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editingId === item.id && (
              <div className="border-t border-white/8 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value as PortfolioCategory })}
                    className="w-full bg-[#141420] border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                  >
                    {portfolioCategories.filter((c) => c.value !== "all").map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Location</label>
                  <input
                    type="text"
                    value={item.location ?? ""}
                    onChange={(e) => updateItem(item.id, { location: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="e.g. Umaid Bhawan, Jodhpur"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Date</label>
                  <input
                    type="text"
                    value={item.date ?? ""}
                    onChange={(e) => updateItem(item.id, { date: e.target.value })}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="e.g. December 2024"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    rows={2}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
                    placeholder="Brief description of this event..."
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Client Feedback</label>
                  <textarea
                    value={item.clientFeedback ?? ""}
                    onChange={(e) => updateItem(item.id, { clientFeedback: e.target.value })}
                    rows={2}
                    className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
                    placeholder="Client testimonial for this event..."
                  />
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/25 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Done editing
                  </button>
                </div>
              </div>
            )}

            {/* Delete confirmation */}
            {confirmDelete === item.id && (
              <div className="border-t border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between gap-3">
                <p className="text-red-300 text-sm">Delete this image permanently?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1.5 rounded-lg border border-white/15 text-[#b0b0c0] text-xs hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
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

      {/* Bottom publish bar */}
      {items.length > 0 && (
        <div className="sticky bottom-0 mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-[#0B0B0F]/90 backdrop-blur-md border-t border-white/8 flex items-center justify-between gap-3">
          <p className="text-[#8a8a9a] text-xs hidden sm:block">
            {items.filter((i) => i._isNew).length > 0
              ? `${items.filter((i) => i._isNew).length} new image(s) not yet saved`
              : "All changes in draft"}
          </p>
          <div className="flex gap-2 ml-auto">
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Publish to Live Site
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
