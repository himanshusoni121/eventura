/**
 * Eventura CMS — client-side API helpers
 * All calls go to the Cloudflare Pages Functions at /api/*
 */

const TOKEN_KEY = "eventura_admin_token";

// ── Token management ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  const token = getToken();
  if (!token) return false;
  // Quick expiry check without server round-trip
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

// ── Authenticated fetch wrapper ───────────────────────────────────────────────

async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(path, { ...options, headers });
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export async function login(password: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json() as { token?: string; error?: string };
  if (!res.ok || !data.token) {
    return { ok: false, error: data.error ?? "Login failed" };
  }
  setToken(data.token);
  return { ok: true };
}

export function logout(): void {
  clearToken();
}

// ── Manifest API ──────────────────────────────────────────────────────────────

export type Section = "portfolio" | "marquee" | "hero" | "about" | "services" | "statistics" | "testimonials" | "contact" | "site";

export async function getManifest(section: Section, draft = false): Promise<unknown> {
  const url = draft
    ? `/api/manifest/${section}?draft=true`
    : `/api/manifest/${section}`;
  const res = await apiFetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function saveManifest(
  section: Section,
  data: unknown,
  draft = false
): Promise<{ ok: boolean; error?: string }> {
  const url = `/api/manifest/${section}${draft ? "?draft=true" : ""}`;
  const res = await apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const json = await res.json() as { ok?: boolean; error?: string };
  return { ok: res.ok && !!json.ok, error: json.error };
}

export async function publishManifest(
  section: Section,
  data: unknown
): Promise<{ ok: boolean; error?: string }> {
  return saveManifest(section, data, false);
}

export async function saveDraft(
  section: Section,
  data: unknown
): Promise<{ ok: boolean; error?: string }> {
  return saveManifest(section, data, true);
}

// ── Upload API ────────────────────────────────────────────────────────────────

export interface UploadResult {
  ok: boolean;
  key?: string;
  url?: string;
  size?: number;
  error?: string;
}

export async function uploadImage(
  file: File,
  section: Section,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("section", section);

  // Use XMLHttpRequest for progress tracking if callback provided
  if (onProgress) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
      const token = getToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText) as UploadResult;
          resolve(xhr.status === 200 ? data : { ok: false, error: data.error ?? "Upload failed" });
        } catch {
          resolve({ ok: false, error: "Invalid server response" });
        }
      };
      xhr.onerror = () => resolve({ ok: false, error: "Network error" });
      xhr.send(form);
    });
  }

  const res = await apiFetch("/api/upload", { method: "POST", body: form });
  const data = await res.json() as UploadResult;
  return res.ok ? data : { ok: false, error: data.error ?? "Upload failed" };
}

// ── Delete API ────────────────────────────────────────────────────────────────

export async function deleteImage(key: string): Promise<{ ok: boolean; error?: string }> {
  const res = await apiFetch(`/api/delete?key=${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
  const data = await res.json() as { ok?: boolean; error?: string };
  return { ok: res.ok && !!data.ok, error: data.error };
}
