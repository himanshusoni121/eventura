/**
 * GET  /api/manifest/[section]  — public, returns published manifest
 * PUT  /api/manifest/[section]  — auth required, saves draft or publishes
 * DELETE /api/manifest/[section]  — auth required, resets to static defaults
 *
 * Sections: portfolio | marquee | hero
 */

import { requireAuth, jsonHeaders, corsPreflightResponse } from "../_lib/auth";

interface R2ObjectBody {
  text(): Promise<string>;
  body: ReadableStream;
  size: number;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<void>;
  delete(key: string | string[]): Promise<void>;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  EVENTURA_R2?: R2Bucket;
  EVENTURA_KV?: KVNamespace;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
}

const VALID_SECTIONS = ["portfolio", "marquee", "hero", "about", "services", "statistics", "testimonials", "contact", "site", "categories"] as const;
type Section = (typeof VALID_SECTIONS)[number];

function publishedKey(section: Section) {
  return `manifests/${section}.published.json`;
}
function draftKey(section: Section) {
  return `manifests/${section}.draft.json`;
}

async function getStorageData(env: Env, key: string): Promise<string | null> {
  if (env.EVENTURA_KV) {
    return await env.EVENTURA_KV.get(key);
  }
  if (env.EVENTURA_R2) {
    const obj = await env.EVENTURA_R2.get(key);
    return obj ? await obj.text() : null;
  }
  return null;
}

async function putStorageData(env: Env, key: string, data: string): Promise<void> {
  if (env.EVENTURA_KV) {
    await env.EVENTURA_KV.put(key, data);
    return;
  }
  if (env.EVENTURA_R2) {
    await env.EVENTURA_R2.put(key, data, {
      httpMetadata: { contentType: "application/json" },
    });
  }
}

async function deleteStorageData(env: Env, keys: string[]): Promise<void> {
  if (env.EVENTURA_KV) {
    await Promise.all(keys.map(k => env.EVENTURA_KV!.delete(k)));
    return;
  }
  if (env.EVENTURA_R2) {
    await env.EVENTURA_R2.delete(keys);
  }
}

function isValidSection(s: unknown): s is Section {
  return VALID_SECTIONS.includes(s as Section);
}

// ── OPTIONS ───────────────────────────────────────────────────────────────────

export function onRequestOptions(): Response {
  return corsPreflightResponse();
}

// ── GET (public + draft) ──────────────────────────────────────────────────────
// Cloudflare Pages Functions only dispatches one handler per HTTP method,
// so we handle the ?draft=true branch inside the single onRequestGet.

export async function onRequestGet({ request, env, params }: PagesContext): Promise<Response> {
  const section = params.section as string;
  if (!isValidSection(section)) {
    return new Response(JSON.stringify({ error: "Unknown section" }), {
      status: 404, headers: jsonHeaders(),
    });
  }

  const url = new URL(request.url);
  const wantsDraft = url.searchParams.get("draft") === "true";

  // ── Draft path (auth required) ───────────────────────────────────────────
  if (wantsDraft) {
    const authError = await requireAuth(request, env.JWT_SECRET);
    if (authError) return authError;

    // Return draft, fall back to published, fall back to empty
    const text =
      (await getStorageData(env, draftKey(section))) ||
      (await getStorageData(env, publishedKey(section)));

    if (!text) {
      return new Response(JSON.stringify({ items: null }), {
        status: 200, headers: jsonHeaders(),
      });
    }

    return new Response(text, {
      status: 200, headers: jsonHeaders(),
    });
  }

  // ── Public path ──────────────────────────────────────────────────────────
  const text = await getStorageData(env, publishedKey(section));
  if (!text) {
    // No published manifest yet — return empty so client keeps static fallback
    return new Response(JSON.stringify({ items: null, publishedAt: null }), {
      status: 200,
      headers: jsonHeaders({
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
      }),
    });
  }

  return new Response(text, {
    status: 200,
    headers: jsonHeaders({
      "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
    }),
  });
}

// ── PUT (auth — save draft or publish) ────────────────────────────────────────

export async function onRequestPut({ request, env, params }: PagesContext): Promise<Response> {
  const authError = await requireAuth(request, env.JWT_SECRET);
  if (authError) return authError;

  const section = params.section as string;
  if (!isValidSection(section)) {
    return new Response(JSON.stringify({ error: "Unknown section" }), {
      status: 404, headers: jsonHeaders(),
    });
  }

  const url = new URL(request.url);
  const isDraft = url.searchParams.get("draft") === "true";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: jsonHeaders(),
    });
  }

  const manifest = JSON.stringify({
    ...(body as Record<string, unknown>),
    updatedAt: new Date().toISOString(),
    ...(isDraft ? {} : { publishedAt: new Date().toISOString() }),
  });

  const key = isDraft ? draftKey(section) : publishedKey(section);
  await putStorageData(env, key, manifest);

  // If publishing, also persist to draft key so admin always sees latest
  if (!isDraft) {
    await putStorageData(env, draftKey(section), manifest);
  }

  return new Response(
    JSON.stringify({ ok: true, key, isDraft }),
    { status: 200, headers: jsonHeaders() }
  );
}

// ── DELETE (auth — clear published manifest, revert to static defaults) ───────

export async function onRequestDelete({ request, env, params }: PagesContext): Promise<Response> {
  const authError = await requireAuth(request, env.JWT_SECRET);
  if (authError) return authError;

  const section = params.section as string;
  if (!isValidSection(section)) {
    return new Response(JSON.stringify({ error: "Unknown section" }), {
      status: 404, headers: jsonHeaders(),
    });
  }

  await deleteStorageData(env, [publishedKey(section), draftKey(section)]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: jsonHeaders(),
  });
}
