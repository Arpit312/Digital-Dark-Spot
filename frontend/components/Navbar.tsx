"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Menu, User, LifeBuoy } from "lucide-react";
import Logo from "./Logo";
import CommandPalette from "./CommandPalette";
import SideDrawer from "./SideDrawer";
import { getAuthUser, authLogout, type AuthUser } from "@/lib/api";

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

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
      {/* N1 Top Bar with Underline (Classic & Recommended) */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 border-b ${
          scrolled
            ? "h-14 border-white/10 bg-black/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "h-16 border-transparent bg-black/40 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
          {/* Left: Logo (clicking toggles SideDrawer / N3 Left Rail) */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="group flex items-center gap-2 py-1 focus:outline-none"
              title="Click Logo to open side navigation menu"
              aria-label="Open Side Navigation Drawer"
            >
              <Logo />
            </button>

            {/* Desktop Nav Links (N1 with clean underline on active item) */}
            <nav className="hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-2 text-sm transition ${
                      isActive
                        ? "text-white font-medium"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    {item.label}
                    {/* Active underline bar (as shown in N1 design) */}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Search (Q) + Profile Avatar Circle (matching N1) */}
          <div className="flex items-center gap-3">
            {/* Search Button / Icon (matching Q in N1) */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs text-muted transition hover:border-white/30 hover:text-white"
              title="Search reports & sources (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={14} strokeWidth={2} className="text-muted" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-muted sm:inline">
                Ctrl K
              </kbd>
            </button>

            {/* User Profile Avatar Circle (matching circular avatar in N1) */}
            <Link
              href="/profile"
              className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-neutral-900 text-white transition hover:border-white hover:scale-105 overflow-hidden"
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

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="flex md:hidden p-1.5 text-muted hover:text-white"
              onClick={() => setDrawerOpen(true)}
              aria-label="Toggle Navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer (matching N3 Left icon rail & dashboard drawer) */}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Command Palette (matching S1 Command palette search) */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
