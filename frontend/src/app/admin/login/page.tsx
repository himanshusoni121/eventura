// app/admin/login/page.tsx
'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ShieldAlert } from 'lucide-react';

// Mock authentication – replace with real auth logic (e.g., NextAuth, Clerk, Supabase)
async function handleAdminLogin(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (email === 'admin@example.com' && password === 'SecureAdmin123!') {
    return { success: true, error: null };
  }
  return { success: false, error: 'Invalid admin credentials.' };
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await handleAdminLogin(prevState, formData);
    if (result.success) {
      // On success, redirect to the dashboard (or any protected admin page)
      router.push('/admin/dashboard');
    }
    return result;
  }, { success: false, error: null });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900 p-8 border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
          <p className="text-sm text-slate-400">Enter your credentials to access the control panel</p>
        </div>

        {/* Error alert */}
        {state?.error && (
          <div className="flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Login form */}
        <form action={formAction} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Admin Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-5 w-5" />
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-5 w-5" />
              </span>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600">
          Protected route. Unauthorized access attempts are logged.
        </div>
      </div>
    </div>
  );
}
