"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Key } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[440px] z-10">
        <GlassCard className="p-8 flex flex-col gap-6 text-center border-amber-500/20">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto shadow-md">
            <Key className="h-6 w-6" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              Yetkisiz Erişim / Unauthorized Access
            </h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir. Lütfen kullanıcı bilgilerinizle oturum açın.
              <br />
              <span className="text-[var(--text-tertiary)]">Please log in with your credentials to access this page.</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link href="/login" passHref legacyBehavior>
              <Button className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-500/90 hover:to-orange-600/90 text-white font-semibold text-xs tracking-wider uppercase rounded-lg shadow-lg cursor-pointer">
                Giriş Ekranına Git / Go to Login
              </Button>
            </Link>
            <Link href="/" passHref legacyBehavior>
              <Button variant="ghost" className="w-full h-11 border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] text-xs font-semibold rounded-lg cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anasayfa / Return Home
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
