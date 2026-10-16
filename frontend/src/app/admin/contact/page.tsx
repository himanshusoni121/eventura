"use client";

import { useState, useEffect } from "react";
import AdminShell from "../_components/AdminShell";
import { getManifest, saveDraft, publishManifest } from "@/lib/admin-api";
import { siteConfig as staticSiteConfig } from "@/lib/data";
import { Loader2, AlertCircle, Check, Globe, Save, Phone } from "lucide-react";

const SECTION = "contact" as const;

interface ContactManifest {
  phone?: string;
  whatsapp?: string;
  address?: string;
  mapUrl?: string;
  officeHours?: string;
  serviceArea?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
  publishedAt?: string;
  updatedAt?: string;
}

export default function ContactAdminPage() {
  const [data, setData] = useState<ContactManifest>({
    phone: staticSiteConfig.phone,
    whatsapp: staticSiteConfig.whatsapp,
    address: staticSiteConfig.address,
    mapUrl: staticSiteConfig.mapUrl,
    officeHours: staticSiteConfig.officeHours,
    serviceArea: staticSiteConfig.serviceArea,
    social: staticSiteConfig.social,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getManifest(SECTION, true)
      .then((d) => {
        if (d) setData({ ...data, ...(d as ContactManifest) });
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
        ? showToast("✓ Published! Contact info updated on live site within 30 seconds.")
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
        <h1 className="font-heading text-2xl font-bold text-white">Contact Information</h1>
        <p className="text-[#8a8a9a] text-sm mt-0.5">
          Edit contact details and social media links.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              Phone
            </label>
            <input
              type="text"
              value={data.phone ?? ""}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              WhatsApp
            </label>
            <input
              type="text"
              value={data.whatsapp ?? ""}
              onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
              className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Address
          </label>
          <textarea
            value={data.address ?? ""}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            rows={2}
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
            Google Maps Embed URL
          </label>
          <input
            type="text"
            value={data.mapUrl ?? ""}
            onChange={(e) => setData({ ...data, mapUrl: e.target.value })}
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              Office Hours
            </label>
            <input
              type="text"
              value={data.officeHours ?? ""}
              onChange={(e) => setData({ ...data, officeHours: e.target.value })}
              className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#8a8a9a] uppercase tracking-wider mb-2 block">
              Service Area
            </label>
            <input
              type="text"
              value={data.serviceArea ?? ""}
              onChange={(e) => setData({ ...data, serviceArea: e.target.value })}
              className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        </div>

        <div className="border-t border-white/8 pt-6">
          <h3 className="text-sm font-semibold text-white mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Instagram</label>
              <input
                type="text"
                value={data.social?.instagram ?? ""}
                onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })}
                className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">Facebook</label>
              <input
                type="text"
                value={data.social?.facebook ?? ""}
                onChange={(e) => setData({ ...data, social: { ...data.social, facebook: e.target.value } })}
                className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">YouTube</label>
              <input
                type="text"
                value={data.social?.youtube ?? ""}
                onChange={(e) => setData({ ...data, social: { ...data.social, youtube: e.target.value } })}
                className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-[#8a8a9a] font-medium block mb-1.5">LinkedIn</label>
              <input
                type="text"
                value={data.social?.linkedin ?? ""}
                onChange={(e) => setData({ ...data, social: { ...data.social, linkedin: e.target.value } })}
                className="w-full bg-white/6 border border-white/12 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>
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
