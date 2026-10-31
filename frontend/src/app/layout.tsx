import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'DarkSpot Atlas – Multi-Agent AI Information Gap & Conflict Auditor',
  description: 'AI platform that detects information gaps, conflicts, outdated rules, and unanswered questions across multiple public sources with verified evidence quotes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#F4F4F5] antialiased relative selection:bg-white/20 selection:text-white">
        {/* Dynamic Background Engineering Grid & Ambient Glow Layers */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid-blueprint opacity-60" />
          <div className="absolute inset-0 radial-spotlight-top opacity-80" />
          <div className="absolute inset-0 radial-spotlight-accent opacity-40" />
          {/* Subtle perimeter vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0A0A0B_95%)] opacity-85" />
        </div>

        <Navbar />
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
