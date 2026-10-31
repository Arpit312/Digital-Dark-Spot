import "./globals.css";
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const hindi = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-hindi" });
export const metadata = { title: "DarkSpot Atlas", description: "Find what is missing, conflicting or outdated in the information you rely on." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${hindi.variable}`}>
      <body><SmoothScroll><Navbar /><main className="min-h-screen pt-16">{children}</main><Footer /></SmoothScroll></body>
    </html>
  );
}
