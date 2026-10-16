/**
 * DELETE /api/delete?key=images/portfolio/abc.jpg
 * Auth required. Removes an image from R2.
 */

import { requireAuth, jsonHeaders, corsPreflightResponse } from "./_lib/auth";

interface R2Bucket {
  get(key: string): Promise<{ text(): Promise<string> } | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<void>;
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

export function onRequestOptions(): Response {
  return corsPreflightResponse();
}

export async function onRequestDelete({ request, env }: PagesContext): Promise<Response> {
  const authError = await requireAuth(request, env.JWT_SECRET);
  if (authError) return authError;

  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing key parameter" }), {
      status: 400, headers: jsonHeaders(),
    });
  }

  // Safety: only allow deleting from the images/ prefix (not manifests or anything else)
  if (!key.startsWith("images/")) {
    return new Response(JSON.stringify({ error: "Invalid key — can only delete image files" }), {
      status: 403, headers: jsonHeaders(),
    });
  }

  await env.EVENTURA_R2.delete(key);

  return new Response(JSON.stringify({ ok: true, deleted: key }), {
    status: 200, headers: jsonHeaders(),
  });
}
