"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Shield, Mail, Lock, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const { login, isLoggingIn, loginError } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("E-posta ve şifre alanları doldurulmalıdır / Email and password are required.");
      return;
    }

    try {
      await login({ email, password });
      window.location.href = redirectPath;
    } catch (err: any) {
      setErrorMsg(err.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin / Login failed. Verify credentials.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10">
        <GlassCard className="p-8 flex flex-col gap-6 relative border-[var(--border-default)]">
          {/* Brand header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                Broadcaster Portal
              </h1>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">
                Admin Panel & Analytics Console Access
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username/Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                E-Posta / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                <Input
                  type="email"
                  placeholder="name@creator.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-11 bg-[var(--bg-elevated)] border-[var(--border-default)] text-sm rounded-lg"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                Şifre / Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-11 bg-[var(--bg-elevated)] border-[var(--border-default)] text-sm rounded-lg"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {/* Feedback Alerts */}
            {(errorMsg || loginError) && (
              <div className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg || (loginError as Error).message}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 hover:from-[var(--accent-primary)]/90 hover:to-indigo-600/90 text-white font-semibold text-xs tracking-wider uppercase rounded-lg shadow-lg cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap / Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center pt-2 border-t border-[var(--border-default)]">
            <Link href="/" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              Public anasayfaya dön / Return to homepage
            </Link>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="w-full max-w-[420px] z-10 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
