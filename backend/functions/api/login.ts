/**
 * POST /api/login
 * Body: { password: string }
 * Returns: { token: string } — JWT valid for 24 hours
 */

import { signJWT, jsonHeaders, corsPreflightResponse } from "./_lib/auth";

interface Env {
  EVENTURA_R2: R2Bucket;
  ADMIN_PASSWORD: string;
  JWT_SECRET: string;
}

interface R2Bucket {
  get(key: string): Promise<{ text(): Promise<string>; body: ReadableStream; size: number; httpMetadata?: { contentType?: string } } | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<void>;
  delete(key: string | string[]): Promise<void>;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
}

export function onRequestOptions(): Response {
  return corsPreflightResponse();
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  try {
    const body = await request.json() as { password?: string };

    if (!body.password) {
      return new Response(JSON.stringify({ error: "Password required" }), {
        status: 400,
        headers: jsonHeaders(),
      });
    }

    if (!env.ADMIN_PASSWORD || !env.JWT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured — set ADMIN_PASSWORD and JWT_SECRET environment variables" }),
        { status: 503, headers: jsonHeaders() }
      );
    }

    // Timing-safe comparison — prevents timing-based brute-force
    const userPassword = (body.password ?? "").trim();
    const envPassword = (env.ADMIN_PASSWORD ?? "").trim().replace(/^["']|["']$/g, "");

    const enc = new TextEncoder();
    const a = enc.encode(userPassword);
    const b = enc.encode(envPassword);
    let diff = a.length !== b.length ? 1 : 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);

    if (diff !== 0 && userPassword === env.ADMIN_PASSWORD) {
      diff = 0;
    }

    if (diff !== 0) {
      // Add slight delay to further slow brute-force
      await new Promise((r) => setTimeout(r, 300));
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: jsonHeaders(),
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const token = await signJWT(
      { sub: "admin", iat: now, exp: now + 86400 },
      env.JWT_SECRET
    );

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: jsonHeaders(),
    });
  } catch (err) {
    console.error("[login]", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: jsonHeaders(),
    });
  }
}
