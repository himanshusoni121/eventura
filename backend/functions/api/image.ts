/**
 * GET /api/image?key=images/portfolio/abc.jpg
 * Public endpoint — streams an image from R2 with long-lived CDN caching.
 * No auth required (images are public once published).
 */

import { corsPreflightResponse } from "./_lib/auth";

interface R2ObjectBody {
  body: ReadableStream;
  size: number;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: object): Promise<void>;
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

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  // Safety: restrict to images/ prefix only
  if (!key.startsWith("images/")) {
    return new Response("Forbidden", { status: 403 });
  }

  const obj = await env.EVENTURA_R2.get(key);
  if (!obj) {
    return new Response("Image not found", { status: 404 });
  }

  const contentType = obj.httpMetadata?.contentType ?? "image/jpeg";

  return new Response(obj.body, {
    status: 200,
    headers: new Headers({
      "Content-Type": contentType,
      // Cache aggressively at the CDN layer — keys are UUIDs so they're immutable
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    }),
  });
}
