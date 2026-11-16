"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login, isLoggedIn } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/admin/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(password);
    setLoading(false);
    if (result.ok) {
      router.replace("/admin/dashboard");
    } else {
      setError(result.error ?? "Login failed");
      setPassword("");
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 mb-4">
            <Image src="/images/logo.png" alt="Eventura" fill priority className="object-contain" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-wide">
            Eventura
          </h1>
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] mt-1 font-medium">
            Admin Panel
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        >
          <h2 className="font-heading text-xl font-bold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-[#8a8a9a] text-sm mb-6">
            Enter your admin password to continue.
          </p>

          <label className="block text-xs font-semibold text-[#b0b0c0] uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            autoFocus
            className="w-full bg-white/6 border border-white/12 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all placeholder:text-[#6a6a7a]"
          />

          {error && (
            <p className="mt-3 text-red-400 text-xs flex items-center gap-1.5">
              <span className="inline-block w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-[10px]">!</span>
              {error}
            </p>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading || !password}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-sm text-[#0B0B0F] bg-gradient-to-r from-[#D4AF37] to-[#b8962f] hover:from-[#e8c84a] hover:to-[#D4AF37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0B0B0F]/40 border-t-[#0B0B0F] rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-[#6a6a7a] text-xs mt-6">
          <a href="/" className="hover:text-[#D4AF37] transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
