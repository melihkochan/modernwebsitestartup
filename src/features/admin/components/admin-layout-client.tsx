"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sliders,
  Calendar,
  ThumbsUp,
  Vote,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentProfile, usePermissions, useAuth } from "@/features/auth/hooks/use-auth";

interface AdminSidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: AdminSidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Live Controls", href: "#live", icon: Sliders },
  { label: "Schedule", href: "#schedule", icon: Calendar },
  { label: "Suggestions", href: "#suggestions", icon: ThumbsUp },
  { label: "Polls", href: "#polls", icon: Vote },
  { label: "Settings", href: "#settings", icon: Settings },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data: profile } = useCurrentProfile();
  const { data: permissions } = usePermissions();
  const { logout } = useAuth();

  const handleNavClick = (label: string) => {
    setActiveItem(label);
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full bg-[rgba(10,10,10,0.45)] backdrop-blur-md">
      {/* Brand logo & Profile info */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between p-6 pb-2">
          <Link
            href="/admin"
            className="text-lg font-bold text-[var(--text-primary)] tracking-tight hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Zehragn Admin
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="mx-6 p-4 rounded-xl border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0">
            <span className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping" />
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-white font-bold font-mono text-sm uppercase">
              {profile?.username?.substring(0, 1) || "A"}
            </div>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">{profile?.username || "Loading..."}</span>
            <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1 font-semibold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {permissions || "Admin"}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 px-4">
          {SIDEBAR_ITEMS.map((item) => {
            const IconComp = item.icon;
            const isActive = activeItem === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all",
                  isActive
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
                )}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer Back to Site link & Logout */}
      <div className="p-4 border-t border-[var(--border-default)] flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Public Website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all text-left w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Çıkış Yap / Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col lg:flex-row relative">
      
      {/* Mobile Top Header bar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[rgba(10,10,10,0.85)] backdrop-blur-md sticky top-0 z-30">
        <span
          className="text-base font-bold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Zehragn Admin
        </span>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Sidebar container */}
      <aside className="hidden lg:block w-[240px] border-r border-[var(--border-default)] flex-shrink-0 z-20">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar drawers panel */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="w-[240px] h-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {renderSidebarContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin content area */}
      <main className="flex-1 p-6 sm:p-8 overflow-x-hidden min-h-[calc(100vh-62px)] lg:min-h-screen">
        {children}
      </main>
    </div>
  );
}
