import Link from "next/link";
import Logo from "./Logo";
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2"><Logo /><p className="mt-4 max-w-sm text-sm text-muted">Finds what is missing, conflicting or outdated in your sources. Findings are potential gaps, not guaranteed facts.</p></div>
        <div className="space-y-2 text-sm"><div className="text-subtle">Product</div>{[["Analyze", "/analyze"], ["Reports", "/reports"], ["Watchtower", "/watchtower"], ["Accuracy", "/accuracy"], ["Officer Deck", "/officer"]].map(([l, h]) => <Link key={h} href={h} className="block text-muted hover:text-fg">{l}</Link>)}</div>
        <div className="space-y-2 text-sm"><div className="text-subtle">Resources & Account</div>{[["User Profile", "/profile"], ["Customer Support", "/support"], ["How it works", "/how-it-works"], ["Docs", "/docs"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, h]) => <Link key={h} href={h} className="block text-muted hover:text-fg">{l}</Link>)}</div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-subtle">Built for Shinchan Online Hackathon 2026</div>
    </footer>
  );
}
