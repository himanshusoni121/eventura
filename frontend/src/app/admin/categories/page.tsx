"use client";

import { useState, useEffect } from "react";
import AdminShell from "../_components/AdminShell";
import {
  getManifest,
  saveDraft,
  publishManifest,
  type Section,
} from "@/lib/admin-api";
import {
  defaultCategories,
  portfolioItems as staticItems,
  type CategoryItem,
  type PortfolioItem,
} from "@/lib/data";
import {
  FolderKanban,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Save,
  Globe,
  Pencil,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

const SECTION: Section = "categories";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // New Category Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newId, setNewId] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Edit Category State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Delete Confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Auto-slugify label for new categories
  const handleLabelChange = (val: string) => {
    setNewLabel(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setNewId(slug);
  };

  useEffect(() => {
    async function load() {
      try {
        // Load categories manifest
        const data = (await getManifest(SECTION, true)) as {
          items?: CategoryItem[];
        } | null;

        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          setCategories(data.items);
        } else {
          setCategories(defaultCategories.map((c) => ({ ...c })));
        }

        // Also load portfolio items to calculate item counts
        const portData = (await getManifest("portfolio", true)) as {
          items?: PortfolioItem[];
        } | null;

        if (portData?.items && Array.isArray(portData.items)) {
          setPortfolioItems(portData.items);
        } else {
          setPortfolioItems(staticItems);
        }
      } catch {
        setCategories(defaultCategories.map((c) => ({ ...c })));
        setPortfolioItems(staticItems);
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

  // Count items assigned to a category
  function getItemCount(catId: string): number {
    return portfolioItems.filter(
      (p) => p.category?.toLowerCase() === catId.toLowerCase()
    ).length;
  }

  // ── Operations ──────────────────────────────────────────────────────────

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    const cleanLabel = newLabel.trim();
    const cleanId = (newId.trim() || cleanLabel.toLowerCase().replace(/\s+/g, "-")).toLowerCase();

    if (!cleanLabel) {
      showToast("Category name is required", "error");
      return;
    }

    if (cleanId === "all") {
      showToast("'all' is a reserved category identifier", "error");
      return;
    }

    if (categories.some((c) => c.id === cleanId)) {
      showToast(`A category with ID '${cleanId}' already exists`, "error");
      return;
    }

    const newItem: CategoryItem = {
      id: cleanId,
      label: cleanLabel,
      description: newDescription.trim() || undefined,
    };

    setCategories((prev) => [...prev, newItem]);
    setNewLabel("");
    setNewId("");
    setNewDescription("");
    setShowAddForm(false);
    showToast(`Category "${cleanLabel}" added successfully!`);
  }

  function startEditing(cat: CategoryItem) {
    setEditingId(cat.id);
    setEditLabel(cat.label);
    setEditDescription(cat.description || "");
  }

  function saveEditing(id: string) {
    const cleanLabel = editLabel.trim();
    if (!cleanLabel) {
      showToast("Category name cannot be empty", "error");
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              label: cleanLabel,
              description: editDescription.trim() || undefined,
            }
          : cat
      )
    );
    setEditingId(null);
    showToast("Category updated");
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= categories.length) return;
    setCategories((prev) => {
      const copy = [...prev];
      [copy[index], copy[newIdx]] = [copy[newIdx], copy[index]];
      return copy;
    });
  }

  function handleDelete(id: string) {
    const count = getItemCount(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setConfirmDeleteId(null);
    if (count > 0) {
      showToast(`Category removed (${count} items had this category)`, "success");
    } else {
      showToast("Category deleted");
    }
  }

  // ── Save Draft & Publish ────────────────────────────────────────────────

  async function handleSaveDraft() {
    setSaving(true);
    const result = await saveDraft(SECTION, { items: categories });
    setSaving(false);
    if (result.ok) {
      showToast("Draft saved — ready to publish");
    } else {
      showToast(result.error ?? "Failed to save draft", "error");
    }
  }

  async function handlePublish() {
    setPublishing(true);
    const result = await publishManifest(SECTION, { items: categories });
    setPublishing(false);
    if (result.ok) {
      showToast("✓ Published! Category filters updated on live site.");
    } else {
      showToast(result.error ?? "Publish failed", "error");
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
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
              : "bg-red-500/20 border border-red-500/40 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold text-white">Event Categories</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              {categories.length} Total
            </span>
          </div>
          <p className="text-[#8a8a9a] text-sm mt-1">
            Manage portfolio &amp; service categories, filter tabs, and tags shown across the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm text-white font-medium transition-all"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? "Cancel" : "Add Category"}
          </button>
          <button
            id="categories-save-draft-btn"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            id="categories-publish-btn"
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      {/* Add New Category Panel */}
      {showAddForm && (
        <form
          onSubmit={handleAddCategory}
          className="mb-8 p-5 sm:p-6 bg-[#13151B]/95 border border-white/12 rounded-2xl shadow-xl backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-white font-semibold text-base">Create New Category</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#b0b0c0] font-medium block mb-1.5">
                Category Name / Label <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g. Cocktail Nights, Pool Parties"
                className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-[#b0b0c0] font-medium block mb-1.5">
                Category Identifier / Slug (auto-generated)
              </label>
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="e.g. cocktail-nights"
                className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#D4AF37] transition-all font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-[#b0b0c0] font-medium block mb-1.5">
                Short Description (Optional)
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description for category badges or tooltips"
                className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-white/12 text-sm text-[#8a8a9a] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all shadow-md"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const count = getItemCount(cat.id);
          const isEditing = editingId === cat.id;
          const isConfirming = confirmDeleteId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 transition-all hover:border-white/20"
            >
              {isEditing ? (
                /* Inline Edit Mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#8a8a9a] font-medium block mb-1">
                        Category Label
                      </label>
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full bg-white/8 border border-white/15 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#8a8a9a] font-medium block mb-1">
                        Slug ID (Read-only)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={cat.id}
                        className="w-full bg-white/3 border border-white/8 text-[#6a6a7a] rounded-xl px-3 py-2 text-sm font-mono cursor-not-allowed"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-[#8a8a9a] font-medium block mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full bg-white/8 border border-white/15 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3.5 py-1.5 rounded-lg border border-white/12 text-xs text-[#8a8a9a] hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEditing(cat.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-[#0B0B0F] text-xs font-semibold hover:bg-[#e8c84a] transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Index / Grab Handle */}
                    <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center text-xs font-mono font-semibold text-[#D4AF37] shrink-0">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-white font-semibold text-base">{cat.label}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-white/8 text-[#8a8a9a] text-[11px] font-mono">
                          id: {cat.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-medium border border-[#D4AF37]/30">
                          {count} {count === 1 ? "event" : "events"}
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[#8a8a9a] text-xs mt-1 max-w-2xl">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => moveCategory(idx, -1)}
                      disabled={idx === 0}
                      className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveCategory(idx, 1)}
                      disabled={idx === categories.length - 1}
                      className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEditing(cat)}
                      className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-[#b0b0c0] hover:text-white transition-all"
                      title="Edit Category"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {isConfirming ? (
                      <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 rounded-xl px-2 py-1">
                        <span className="text-[11px] text-red-300 font-medium">Delete?</span>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-semibold rounded-md hover:bg-red-600"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 text-[#8a8a9a] hover:text-white text-[11px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="w-8 h-8 rounded-xl bg-red-500/15 hover:bg-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
          <FolderKanban className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
          <p className="text-white font-medium text-base">No categories configured</p>
          <p className="text-[#8a8a9a] text-sm mt-1 mb-4">
            Click &quot;Add Category&quot; above to create your first portfolio filter category.
          </p>
          <button
            onClick={() => setCategories(defaultCategories.map((c) => ({ ...c })))}
            className="px-4 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/30 transition-all"
          >
            Reset to Default Categories
          </button>
        </div>
      )}
    </AdminShell>
  );
}
