"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  User,
  Sparkles,
  FileText,
  ShieldCheck,
  Building2,
  Radio,
  Sliders,
  LogOut,
  LogIn,
  CheckCircle2,
  Phone,
  ChevronRight,
  ExternalLink,
  LifeBuoy,
  Search,
  BookOpen
} from "lucide-react";
import Logo from "./Logo";
import { getAuthUser, authLogout, type AuthUser } from "@/lib/api";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SideDrawer({ open, onClose }: SideDrawerProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const updateUser = () => {
      setUser(getAuthUser());
    };
    updateUser();
    window.addEventListener("darkspot_user_change", updateUser);
    return () => window.removeEventListener("darkspot_user_change", updateUser);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = [
    {
      label: "User Profile",
      sub: "Identity, avatar, phone & Google link",
      href: "/profile",
      icon: User,
      badge: "Account"
    },
    {
      label: "Customer Support & Resolver",
      sub: "AI query solver, ticket triage & helpline",
      href: "/support",
      icon: LifeBuoy,
      badge: "24/7 Desk"
    },
    {
      label: "Analyze Engine",
      sub: "Audit circulars, portals & detect gaps",
      href: "/analyze",
      icon: Sparkles
    },
    {
      label: "Reports Dossier",
      sub: "Verified audit findings & checklists",
      href: "/reports",
      icon: FileText
    },
    {
      label: "Campus Notice Auditor",
      sub: "Student notices & admission guidelines",
      href: "/campus",
      icon: Building2
    },
    {
      label: "Officer Control Deck",
      sub: "Field discrepancy inspection & dispatch",
      href: "/officer",
      icon: ShieldCheck
    },
    {
      label: "Watchtower Feeds",
      sub: "Real-time government circular drift monitor",
      href: "/watchtower",
      icon: Radio
    },
    {
      label: "Accuracy & Benchmarks",
      sub: "Zero-hallucination quote verification",
      href: "/accuracy",
      icon: ShieldCheck
    },
    {
      label: "Documentation & API",
      sub: "Technical specifications and algorithms",
      href: "/docs",
      icon: BookOpen
    },
    {
      label: "Settings & Guardrails",
      sub: "Temporal decay, sensitivity & config",
      href: "/settings",
      icon: Sliders
    }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Drawer Container (N3 dashboard aesthetic) */}
      <aside
        id="side-drawer"
        aria-label="Navigation Drawer"
        className={`fixed inset-y-0 left-0 z-[100] flex w-full max-w-md flex-col border-r border-white/10 bg-black/95 backdrop-blur-2xl text-white shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out sm:max-w-lg ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-mono font-medium text-white">
              MENU
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-white/30 hover:bg-white/5 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* User Snapshot Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 relative overflow-hidden">
            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 rounded-full border border-white/20 bg-neutral-900 overflow-hidden flex items-center justify-center">
                {user?.avatar_url || user?.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url || user.user_metadata?.avatar_url}
                    alt={user.full_name || "User Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-semibold text-base text-white bg-white/10">
                    {(user?.full_name || user?.user_metadata?.full_name || user?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-black bg-white" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="truncate text-sm font-semibold text-white">
                    {user?.full_name || user?.user_metadata?.full_name || "Arpit Sharma"}
                  </h4>
                  <CheckCircle2 size={13} className="text-white shrink-0" />
                </div>
                <p className="truncate text-xs text-muted">
                  {user?.email || "arpit.auditor@darkspotatlas.org"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white">
                    {user?.role || user?.user_metadata?.role || "Citizen Auditor"}
                  </span>
                  {(user?.phone || user?.user_metadata?.phone) && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-white font-mono">
                      <Phone size={10} /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <Link
                href="/profile"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:underline transition"
              >
                Manage Profile & Linked Accounts <ChevronRight size={13} />
              </Link>
              <Link
                href="/support"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-white transition"
              >
                Helpdesk <ExternalLink size={11} />
              </Link>
            </div>
          </div>

          {/* Navigation Items (clean monochrome) */}
          <div className="space-y-1">
            <div className="px-2 pb-2 text-[11px] font-mono tracking-wider uppercase text-muted">
              Navigation & Workspaces
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 transition-all duration-150 ${
                    active
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
                      active
                        ? "border-white/30 bg-white/15 text-white"
                        : "border-white/10 bg-white/[0.02] text-muted group-hover:border-white/20 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium tracking-tight text-white">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="rounded bg-white/10 border border-white/15 px-1.5 py-0.2 text-[9px] font-mono text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted group-hover:text-white/70">
                      {item.sub}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-transform ${
                      active ? "text-white" : "text-muted group-hover:translate-x-0.5 group-hover:text-white"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Customer Support Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <LifeBuoy size={16} className="text-white" />
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Support & Helpdesk
              </h5>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Have doubts about conflicting guidelines, missing clauses, or portal errors? Our support assistant and engineers are available.
            </p>
            <Link
              href="/support"
              onClick={onClose}
              className="btn-primary w-full text-center py-2 text-xs block"
            >
              Open Customer Support
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="shrink-0 border-t border-white/10 bg-black p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted font-mono">
              <span className="h-2 w-2 rounded-full bg-white inline-block" />
              <span>DarkSpot Atlas v2.4</span>
            </div>
            {user ? (
              <button
                onClick={() => {
                  onClose();
                  authLogout();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
              >
                <LogOut size={13} />
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
              >
                <LogIn size={13} />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
