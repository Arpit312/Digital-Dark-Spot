"use client";

import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Building,
  Key,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Send,
  Users,
  ChevronRight,
  Database
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

interface AuditDiscrepancy {
  id: string;
  scheme: string;
  portalClaim: string;
  portalUrl: string;
  faqClaim: string;
  faqUrl: string;
  citizensAffected: string;
  status: "Conflict" | "Resolved" | "Investigating";
}

const auditDiscrepancies: AuditDiscrepancy[] = [
  {
    id: "gov-01",
    scheme: "National Merit Scholarship (Post-Matric)",
    portalClaim: "Application Cutoff: 31 October 2026 (Portal Banner)",
    portalUrl: "https://scholarships.gov.in/notices/2026",
    faqClaim: "Application Cutoff: 15 November 2026 (FAQ Document §4.2)",
    faqUrl: "https://scholarships.gov.in/docs/FAQ_2026_Rev2.pdf",
    citizensAffected: "28,400+ Applicants",
    status: "Conflict"
  },
  {
    id: "gov-02",
    scheme: "UGC Doctoral Fellowship (JRF / SRF)",
    portalClaim: "Continuation Certificate requires physical submission to Canara Bank",
    portalUrl: "https://ugc.gov.in/fellowships",
    faqClaim: "100% digital submission enabled through DigiLocker Integration",
    faqUrl: "https://ugc.gov.in/circulars/digi_2026.pdf",
    citizensAffected: "6,200+ Scholars",
    status: "Conflict"
  },
  {
    id: "gov-03",
    scheme: "Central Sector Scheme for College Students",
    portalClaim: "Income limit capped at ₹4.50 Lakhs per annum",
    portalUrl: "https://education.gov.in/schemes/csss",
    faqClaim: "Income limit revised to ₹6.00 Lakhs in Gazette Notification 2025/11",
    faqUrl: "https://egazette.gov.in/CSSS_2025.pdf",
    citizensAffected: "41,000+ Eligible Students",
    status: "Conflict"
  }
];

const frictionDistricts = [
  { district: "District Patna (Bihar)", applicants: "14,200", frictionScore: 88, dropoffPoint: "Aadhaar-NPCI Bank Seeding Verification" },
  { district: "District Jaipur (Rajasthan)", applicants: "11,800", frictionScore: 79, dropoffPoint: "Income Certificate Validity Format" },
  { district: "District Varanasi (Uttar Pradesh)", applicants: "18,400", frictionScore: 92, dropoffPoint: "Institute Bonafide Upload Clause" },
  { district: "District Pune (Maharashtra)", applicants: "9,600", frictionScore: 61, dropoffPoint: "Disability Certificate Digital Verification" }
];

const registrySources = [
  { name: "National Scholarship Portal (Central DB)", url: "scholarships.gov.in", hash: "0x89f2a...4b01", signatures: "2 of 2 Signed", status: "Active Canonical" },
  { name: "UGC Central Regulation Repository", url: "ugc.gov.in/regulations", hash: "0x44c1d...e882", signatures: "2 of 2 Signed", status: "Active Canonical" },
  { name: "Ministry of Education Scheme Directorate", url: "education.gov.in/orders", hash: "0x23a9b...71c4", signatures: "1 of 2 Pending", status: "Verification In Progress" },
  { name: "State Directorate of Higher Education", url: "dhe.gov.in/archive", hash: "0x12d8a...991e", signatures: "Superseded", status: "Archived Gazette" }
];

export default function Officer() {
  const [activeTab, setActiveTab] = useState<"auditor" | "intelligence" | "registry" | "dispatch">("auditor");
  const [selectedAudit, setSelectedAudit] = useState<AuditDiscrepancy>(auditDiscrepancies[0]);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const handlePushClarification = () => {
    setDispatchStatus("Pushed to staging. Awaiting Co-Signer verification.");
    setTimeout(() => {
      setDispatchStatus("Official Addendum Broadcasted: Hash 0x98f...d3a published.");
    }, 1500);
  };

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="OFFICER CONSOLE"
        title="Public Authority & Scheme Governance Suite"
        sub="Inter-departmental consistency auditor, differential privacy citizen friction analytics, and cryptographic multi-signature source registry for designated verification officers."
      >
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
            <ShieldCheck size={13} />
            Verified Officer: GOV-IN-7824 (Ministry of Education)
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
            <Key size={13} />
            Ed25519 Cryptographic Co-Signer Active
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Module Navigation */}
        <div className="flex border-b border-line mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("auditor")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "auditor"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <AlertTriangle size={15} />
            Consistency Auditor
            <span className="badge ml-1 bg-red-500/20 text-red-400 text-xs">3 Conflicts</span>
          </button>
          <button
            onClick={() => setActiveTab("intelligence")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "intelligence"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Users size={15} />
            Citizen Friction Intelligence (k ≥ 10)
          </button>
          <button
            onClick={() => setActiveTab("registry")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "registry"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Database size={15} />
            Authoritative Source Registry
          </button>
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "dispatch"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Send size={15} />
            Clarification Dispatch Desk
          </button>
        </div>

        {/* Tab 1: Consistency Auditor */}
        {activeTab === "auditor" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Conflict Selector */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-subtle mb-1">
                Active Portal Conflicts ({auditDiscrepancies.length})
              </div>
              {auditDiscrepancies.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAudit(item)}
                  className={`card cursor-pointer p-4 transition ${
                    selectedAudit.id === item.id
                      ? "border-white bg-white/[0.05]"
                      : "hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-subtle">{item.citizensAffected}</span>
                    <span className="badge text-[10px] uppercase font-mono border-red-500/40 text-red-400">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold">{item.scheme}</h4>
                  <p className="mt-1 text-xs text-muted line-clamp-1">{item.portalClaim}</p>
                </div>
              ))}
            </div>

            {/* Right Audit Inspection Box */}
            <div className="lg:col-span-7">
              <div className="card p-6">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted">
                      Inter-Portal Discrepancy Inspection
                    </span>
                    <h3 className="mt-1 text-base font-semibold">{selectedAudit.scheme}</h3>
                  </div>
                  <span className="badge text-xs uppercase font-mono border-red-500/40 text-red-400">
                    High Priority
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Portal Stated Info */}
                  <div className="rounded-xl border border-line bg-card/60 p-4">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="font-semibold text-fg">Public Portal Homepage Banner</span>
                      <a
                        href={selectedAudit.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-fg hover:underline"
                      >
                        Source Link <ExternalLink size={11} />
                      </a>
                    </div>
                    <p className="mt-2 text-xs font-mono text-amber-300">
                      {selectedAudit.portalClaim}
                    </p>
                  </div>

                  {/* FAQ / Gazette Stated Info */}
                  <div className="rounded-xl border border-line bg-card/60 p-4">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="font-semibold text-fg">Revised Gazette / Policy FAQ Document</span>
                      <a
                        href={selectedAudit.faqUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-fg hover:underline"
                      >
                        PDF Reference <ExternalLink size={11} />
                      </a>
                    </div>
                    <p className="mt-2 text-xs font-mono text-emerald-300">
                      {selectedAudit.faqClaim}
                    </p>
                  </div>

                  {/* Citizen Impact Notice */}
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs">
                    <div className="font-semibold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle size={13} /> High Friction Risk
                    </div>
                    <p className="mt-1 text-fg/90">
                      Discrepancy causes applicants to rush or forfeit submissions due to outdated date banners on the root domain.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveTab("dispatch")}
                      className="btn-primary text-xs inline-flex items-center gap-1.5"
                    >
                      <Send size={13} />
                      Issue Synchronized Clarification Addendum
                    </button>
                    <button
                      onClick={() => alert("Verification audit packet exported.")}
                      className="btn-ghost text-xs"
                    >
                      Download Audit Packet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Confusion Intelligence */}
        {activeTab === "intelligence" && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-semibold">Citizen Confusion Intelligence ($k \ge 10$)</h3>
                  <p className="text-xs text-muted">
                    Differential privacy aggregated metrics identifying where citizens experience dark spots in public schemes.
                  </p>
                </div>
                <div className="badge border-emerald-500/30 text-emerald-400 text-xs">
                  Anonymized Differential Privacy
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {frictionDistricts.map((item) => (
                  <div key={item.district} className="rounded-xl border border-line bg-card/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{item.district}</span>
                      <span className="badge text-[10px] font-mono text-muted">
                        {item.applicants} queries
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted">
                      Primary Confusion Drop-off: <span className="text-fg">{item.dropoffPoint}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-muted">Friction Severity</span>
                      <span className={item.frictionScore > 80 ? "text-red-400" : "text-amber-400"}>
                        {item.frictionScore} / 100
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-line overflow-hidden">
                      <div
                        className={`h-full ${item.frictionScore > 80 ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${item.frictionScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Authoritative Source Registry */}
        {activeTab === "registry" && (
          <div className="card p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-base font-semibold">Cryptographic Source Registry</h3>
                <p className="text-xs text-muted">
                  Canonical government portals and gazette repositories validated with Ed25519 multi-signatures.
                </p>
              </div>
              <button
                onClick={() => alert("Officer signature verification required to register new canonical domain.")}
                className="btn-primary text-xs"
              >
                + Register Authoritative Domain
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {registrySources.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-col gap-3 rounded-xl border border-line bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-xs text-muted font-mono mt-0.5">{s.url}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-subtle">SHA: {s.hash}</span>
                    <span className="badge border-white/20 text-fg">{s.signatures}</span>
                    <span
                      className={`badge ${
                        s.status.includes("Active")
                          ? "border-emerald-500/30 text-emerald-400"
                          : s.status.includes("Progress")
                          ? "border-amber-500/30 text-amber-400"
                          : "border-line text-subtle"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dispatch Desk */}
        {activeTab === "dispatch" && (
          <div className="card p-6 max-w-3xl mx-auto">
            <div className="border-b border-line pb-4">
              <h3 className="text-base font-semibold">1-Click Clarification Addendum Dispatch</h3>
              <p className="text-xs text-muted mt-1">
                Broadcast an official, cryptographically signed clarification note across all portals to resolve a detected dark spot.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted uppercase">Target Scheme</label>
                <div className="mt-1 font-mono text-sm text-fg rounded-lg border border-line bg-card/60 p-3">
                  National Merit Scholarship (Post-Matric) - NSP-2026-OCT
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase">Clarification Addendum Text</label>
                <textarea
                  defaultValue="It is hereby clarified to all candidates and participating institutions that the institutional verification deadline has been officially synchronized to 15 November 2026 (11:59 PM IST). Portal banners indicating 31 October are superseded by Gazette Order MoE/NSP/2026-Rev2."
                  className="input mt-1 h-28 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted flex items-center justify-between">
                <span>Ed25519 Signing Officer: GOV-IN-7824 (Asha R.)</span>
                <span className="text-emerald-400 font-mono">Signatures: 1 of 2 Ready</span>
              </div>

              {dispatchStatus && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400">
                  {dispatchStatus}
                </div>
              )}

              <button
                onClick={handlePushClarification}
                className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <Send size={14} />
                Co-Sign and Dispatch Official Addendum
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
