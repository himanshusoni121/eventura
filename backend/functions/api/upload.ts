/**
 * POST /api/upload
 * Accepts multipart/form-data:
 *   file     — image File (JPEG | PNG | WebP, max 8 MB)
 *   section  — "portfolio" | "marquee" | "hero"
 *
 * Returns: { key: string, url: string }
 * The returned URL (/api/image?key=...) can be used directly in manifests.
 */

import { requireAuth, jsonHeaders, corsPreflightResponse } from "./_lib/auth";

interface R2Bucket {
  get(key: string): Promise<{ text(): Promise<string>; body: ReadableStream } | null>;
  put(key: string, value: ArrayBuffer | ReadableStream | string, options?: { httpMetadata?: { contentType?: string } }): Promise<void>;
  delete(key: string | string[]): Promise<void>;
}

interface Env {
  EVENTURA_R2: R2Bucket;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function generateId(): string {
  // Use crypto.randomUUID if available (Workers runtime has it)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  // Fallback: timestamp + random
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function onRequestOptions(): Response {
  return corsPreflightResponse();
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  const authError = await requireAuth(request, env.JWT_SECRET);
  if (authError) return authError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid multipart form data" }), {
      status: 400, headers: jsonHeaders(),
    });
  }

  const file = formData.get("file") as File | null;
  const section = (formData.get("section") as string | null) ?? "portfolio";

  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400, headers: jsonHeaders(),
    });
  }

  // Validate MIME type
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return new Response(
      JSON.stringify({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }),
      { status: 400, headers: jsonHeaders() }
    );
  }

  // Validate size
  if (file.size > MAX_BYTES) {
    return new Response(
      JSON.stringify({ error: `File too large. Maximum size is 8 MB.` }),
      { status: 413, headers: jsonHeaders() }
    );
  }

  const validSections = ["portfolio", "marquee", "hero"];
  const safeSection = validSections.includes(section) ? section : "portfolio";

  const id = generateId();
  const key = `images/${safeSection}/${id}.${ext}`;

  const buffer = await file.arrayBuffer();
  await env.EVENTURA_R2.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });

  // Return the key and the proxy URL
  const url = `/api/image?key=${encodeURIComponent(key)}`;

  return new Response(JSON.stringify({ ok: true, key, url, size: file.size, type: file.type }), {
    status: 200,
    headers: jsonHeaders(),
  });
}
