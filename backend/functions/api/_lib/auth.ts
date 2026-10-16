/**
 * Eventura CMS — JWT & CORS utilities
 * Uses the Web Crypto API available in Cloudflare Workers (no npm packages needed).
 */

// ── Base64URL helpers ─────────────────────────────────────────────────────────

function b64UrlEncode(data: ArrayBuffer | string): string {
  let binary: string;
  if (typeof data === "string") {
    binary = data;
  } else {
    binary = String.fromCharCode(...new Uint8Array(data));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function b64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = padded.length % 4 === 0 ? 0 : 4 - (padded.length % 4);
  const binary = atob(padded + "=".repeat(padLen));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

// ── JWT ───────────────────────────────────────────────────────────────────────

export async function signJWT(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const header = b64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64UrlEncode(JSON.stringify(payload));
  const message = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );

  return `${message}.${b64UrlEncode(sig)}`;
}

export async function verifyJWT(
  token: string,
  secret: string
): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, sig] = parts;
    const message = `${header}.${body}`;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64UrlDecode(sig) as BufferSource,
      new TextEncoder().encode(message)
    );
    if (!valid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(b64UrlDecode(body))
    ) as Record<string, unknown>;

    if (payload.exp && typeof payload.exp === "number") {
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export function extractToken(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/** Returns an error Response if auth fails, or null if auth passes. */
export async function requireAuth(
  request: Request,
  jwtSecret: string
): Promise<Response | null> {
  const token = extractToken(request);
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders(),
    });
  }
  const payload = await verifyJWT(token, jwtSecret);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
      headers: jsonHeaders(),
    });
  }
  return null;
}

// ── Response helpers ──────────────────────────────────────────────────────────

export function jsonHeaders(extra?: Record<string, string>): Headers {
  return new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...extra,
  });
}

export function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    }),
  });
}
