"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Search, Menu } from "lucide-react";
import Logo from "./Logo";
import CommandPalette from "./CommandPalette";
import SideDrawer from "./SideDrawer";
import { getAuthUser, type AuthUser } from "@/lib/api";

// Matching N1 Top bar with underline from the user's design reference
const NAV_LINKS = [
  { label: "Analyze", href: "/analyze" },
  { label: "Reports", href: "/reports" },
  { label: "Alerts", href: "/watchtower" },
  { label: "Campus", href: "/campus" },
  { label: "Support", href: "/support" }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const refreshChecked = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (refreshChecked.current) return;
    refreshChecked.current = true;

    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigation?.type === "reload" && pathname !== "/") {
      router.replace("/");
    }
  }, [pathname, router]);

  useEffect(() => {
    const updateUser = () => {
      setUser(getAuthUser());
    };
    updateUser();
    window.addEventListener("darkspot_user_change", updateUser);

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("darkspot_user_change", updateUser);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-all duration-200 ${
          scrolled
            ? "border-white/10 bg-black/85 shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent bg-black/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-2 justify-self-start">
            {pathname !== "/" && (
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-white/25 hover:bg-white/5 hover:text-white"
                title="Go back"
                aria-label="Go back to previous page"
              >
                <ArrowLeft size={17} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="group flex items-center rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              title="Open account and navigation menu"
              aria-label="Open account and navigation menu"
            >
              <Logo />
            </button>
          </div>

          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex xl:gap-8">
            {NAV_LINKS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative whitespace-nowrap py-2 text-sm transition ${
                    isActive ? "font-medium text-white" : "text-muted hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.65)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 justify-self-end sm:gap-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 text-xs text-muted transition hover:border-white/30 hover:text-white sm:px-3"
              title="Search reports & sources (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={14} strokeWidth={2} className="text-muted" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-muted lg:inline">
                Ctrl K
              </kbd>
            </button>

            <Link
              href="/profile"
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-neutral-900 text-white transition hover:scale-105 hover:border-white"
              title={user ? `${user.full_name || user.email} (View Profile)` : "View Profile & Options"}
              aria-label="User Profile"
            >
              {user?.avatar_url || user?.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url || user.user_metadata?.avatar_url}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-white">
                  {(user?.full_name || user?.user_metadata?.full_name || user?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="flex rounded-lg p-2 text-muted transition hover:bg-white/5 hover:text-white md:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
