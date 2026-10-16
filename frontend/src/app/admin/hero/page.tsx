"use client";

import { useState, useEffect, useRef } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest, uploadImage, deleteImage } from "@/lib/admin-api";
import Image from "next/image";
import {
  Upload, Trash2, Loader2, AlertCircle, Check, Globe, Save, ImageIcon,
} from "lucide-react";

const SECTION = "hero" as const;

interface HeroManifest {
  heroImage?: string;
  heroKey?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export default function HeroAdminPage() {
  const [current, setCurrent] = useState<HeroManifest | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getManifest(SECTION, true)
      .then((d) => {
        if (d) setCurrent(d as HeroManifest);
      })
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFileSelect(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Only JPEG, PNG, and WebP files are supported.", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("File too large. Maximum 8 MB.", "error");
      return;
    }
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleUploadAndSave(publish: boolean) {
    if (!pendingFile && !current?.heroImage) {
      showToast("No image selected.", "error");
      return;
    }

    let heroImage = current?.heroImage ?? "";
    let heroKey = current?.heroKey ?? "";

    if (pendingFile) {
      setUploading(true);
      setUploadProgress(0);

      // Delete old R2 image if exists
      if (heroKey) await deleteImage(heroKey);

      const result = await uploadImage(pendingFile, SECTION, setUploadProgress);
      setUploading(false);

      if (!result.ok || !result.url) {
        showToast(result.error ?? "Upload failed", "error");
        return;
      }

      heroImage = result.url;
      heroKey = result.key ?? "";
      setPendingFile(null);
      setPreview(null);
      setCurrent((prev) => ({ ...prev, heroImage, heroKey }));
    }

    const manifest: HeroManifest = { heroImage, heroKey };

    if (publish) {
      setPublishing(true);
      const result = await publishManifest(SECTION, manifest);
      setPublishing(false);
      result.ok
        ? showToast("✓ Published! Hero image updated on live site within 30 seconds.")
        : showToast(result.error ?? "Publish failed", "error");
    } else {
      setSaving(true);
      const result = await saveDraft(SECTION, manifest);
      setSaving(false);
      result.ok ? showToast("Draft saved") : showToast(result.error ?? "Save failed", "error");
    }
  }

  const displayImage = preview ?? current?.heroImage ?? null;

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

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Hero Background</h1>
        <p className="text-[#8a8a9a] text-sm mt-0.5">
          The full-screen background image of the homepage hero section.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current / Preview image */}
        <div>
          <p className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-3">
            {preview ? "New image preview" : "Current published image"}
          </p>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
            {displayImage ? (
              <>
                <Image
                  src={displayImage}
                  alt="Hero background"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Preview overlay</p>
                    <p className="font-heading text-white text-2xl font-bold">Eventura</p>
                    <p className="text-[#D4AF37] text-xs mt-1">Creating Extraordinary Experiences</p>
                  </div>
                </div>
                {preview && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Pending upload
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6a6a7a]">
                <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm">Using default static image</p>
                <p className="text-xs mt-1">(/images/home.png)</p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                <div className="w-48 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-white text-sm">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>

          {current?.publishedAt && (
            <p className="text-xs text-[#6a6a7a] mt-2">
              Last published: {new Date(current.publishedAt).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* Upload controls */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider">
            Replace image
          </p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDraggingOver
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-white/15 hover:border-[#D4AF37]/50 hover:bg-white/3"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { handleFileSelect(file); e.target.value = ""; }
              }}
            />
            <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <p className="text-white font-medium text-sm mb-1">
              {pendingFile ? pendingFile.name : "Drop image here or click to browse"}
            </p>
            <p className="text-[#6a6a7a] text-xs">
              {pendingFile
                ? `${(pendingFile.size / 1024 / 1024).toFixed(1)} MB · Click to change`
                : "JPEG · PNG · WebP · Max 8 MB · Recommended: 1920×1080 or larger"}
            </p>
          </div>

          {/* Tips */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-semibold text-[#D4AF37]">Tips for best results</p>
            <p className="text-xs text-[#8a8a9a]">• Landscape orientation (16:9 ratio preferred)</p>
            <p className="text-xs text-[#8a8a9a]">• Minimum 1280×720 pixels</p>
            <p className="text-xs text-[#8a8a9a]">• Dark or semi-dark images show the text overlay best</p>
            <p className="text-xs text-[#8a8a9a]">• Keep under 8 MB for fast page loads</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => handleUploadAndSave(false)}
              disabled={saving || uploading || publishing}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 text-sm text-[#b0b0c0] hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button
              onClick={() => handleUploadAndSave(true)}
              disabled={publishing || uploading || saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b8962f] text-[#0B0B0F] text-sm font-semibold hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Upload & Publish
            </button>
          </div>

          {/* Reset to static default */}
          {current?.heroImage && (
            <button
              onClick={async () => {
                if (!confirm("Reset hero to the static default image (home.png)?")) return;
                await publishManifest(SECTION, { heroImage: null, heroKey: null });
                setCurrent(null);
                showToast("Reset to default static image");
              }}
              className="w-full py-2 rounded-xl border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 text-xs transition-all"
            >
              Reset to default static image
            </button>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
