"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Search,
  Check
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

interface SampleDiscrepancy {
  id: string;
  category: string;
  title: string;
  noticeExcerpt: string;
  referenceExcerpt: string;
  noticeSource: string;
  referenceSource: string;
  severity: "critical" | "warning" | "advisory";
  remediation: string;
}

const sampleDiscrepancies: SampleDiscrepancy[] = [
  {
    id: "camp-01",
    category: "Hostel & Fees",
    title: "Hostel Fee Refund & Caution Deposit Contradiction",
    noticeExcerpt: "All caution deposits are non-refundable if withdrawal is submitted after Day 15 of semester commencement.",
    referenceExcerpt: "UGC Fee Refund Mandate 2026 Clause 4.1: 100% refund of caution deposits and proportional hostel fees up to 30 days.",
    noticeSource: "Campus Circular No. HOSTEL/2026/08 (Dated: 12 Aug 2026)",
    referenceSource: "UGC Central Regulation Gazette F.No. 1-3/2026(CPP-II)",
    severity: "critical",
    remediation: "Revise Section 3 of circular to align with UGC 30-day proportional refund window."
  },
  {
    id: "camp-02",
    category: "Academic Examinations",
    title: "Attendance Cutoff vs Medical Exemption Discrepancy",
    noticeExcerpt: "Strict 75% aggregate attendance required. No medical waivers will be entertained for Semester End Exams.",
    referenceExcerpt: "University Academic Ordinance §18.B: Medical certificates endorsed by Chief Medical Officer grant up to 10% waiver (cutoff 65%).",
    noticeSource: "Examination Branch Notification EXAM/ODD/2026/41",
    referenceSource: "University Statute Book & Academic Council Ordinance 2024",
    severity: "warning",
    remediation: "Append clause stating medical waiver provision under Ordinance §18.B with CMO submission deadline."
  },
  {
    id: "camp-03",
    category: "Scholarships",
    title: "NSP Post-Matric Document Verification Date Conflict",
    noticeExcerpt: "Institute level verification portal closes permanently on 31 October 2026 at 5:00 PM.",
    referenceExcerpt: "MoE Official Order NSP/REV/2026-09: Institutional verification window extended nationwide to 15 November 2026.",
    noticeSource: "Dean Student Welfare Circular DSW/SCH/2026/19",
    referenceSource: "National Scholarship Portal MoE Notification",
    severity: "critical",
    remediation: "Update notice board to reflect the extended MoE 15 November cutoff."
  },
  {
    id: "camp-04",
    category: "Admissions",
    title: "Migration Certificate Submission Grace Period Missing",
    noticeExcerpt: "Original migration certificate must be produced at counter on day of counseling or admission will be forfeited.",
    referenceExcerpt: "State Higher Education Directorate Guidelines: Candidates may submit an undertaking with 30-day grace period.",
    noticeSource: "Central Admission Brochure 2026 Page 14",
    referenceSource: "Directorate of Higher Education Circular 884/HE/2026",
    severity: "advisory",
    remediation: "Include standard 30-day undertaking template in counseling package."
  }
];

const confusionDepartments = [
  { dept: "Computer Science & Eng", score: 82, noticesScanned: 34, primaryGap: "Attendance & Lab Submission Rules" },
  { dept: "Mechanical & Civil Eng", score: 68, noticesScanned: 28, primaryGap: "Elective Subject Allotment Criteria" },
  { dept: "Hostel & Student Housing", score: 94, noticesScanned: 19, primaryGap: "Fee Refund Window & Mess Rebates" },
  { dept: "Dean of Academic Affairs", score: 76, noticesScanned: 42, primaryGap: "Detention Warning Notification Dates" },
  { dept: "Central Scholarship Cell", score: 91, noticesScanned: 14, primaryGap: "Aadhaar Seeding & Income Certificate Validity" }
];

export default function Campus() {
  const [activeTab, setActiveTab] = useState<"scanner" | "conflicts" | "confusion" | "checklist">("scanner");
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<SampleDiscrepancy>(sampleDiscrepancies[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleSimulateScan = (name: string) => {
    setSelectedFileName(name);
    setIsAnalyzing(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setScanComplete(true);
    }, 1200);
  };

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="CAMPUS NOTICE AUDITOR"
        title="Audit college notices before students get confused."
        sub="Scan admission brochures, hostel bylaws, fee schedules, and exam notifications against statutory university regulations to intercept contradictory clauses instantly."
      />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
          <div className="card p-4">
            <div className="text-xs text-muted">Circulars Audited</div>
            <div className="mt-1 text-2xl font-semibold">1,840+</div>
            <div className="mt-1 text-[11px] text-emerald-400">Across 42 Universities</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-muted">Contradictions Caught</div>
            <div className="mt-1 text-2xl font-semibold">312</div>
            <div className="mt-1 text-[11px] text-amber-400">Before notice publication</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-muted">Confusion Reduction</div>
            <div className="mt-1 text-2xl font-semibold">74%</div>
            <div className="mt-1 text-[11px] text-emerald-400">In student grievance queue</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-muted">Resolution Turnaround</div>
            <div className="mt-1 text-2xl font-semibold">4.2 hrs</div>
            <div className="mt-1 text-[11px] text-subtle">Down from 9 business days</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-line mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "scanner"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <UploadCloud size={15} />
            Live Notice Scanner
          </button>
          <button
            onClick={() => setActiveTab("conflicts")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "conflicts"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <AlertTriangle size={15} />
            Discrepancy Matrix
            <span className="badge ml-1 bg-white/10 text-xs">4 detected</span>
          </button>
          <button
            onClick={() => setActiveTab("confusion")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "confusion"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Layers size={15} />
            Student Confusion Radar
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "checklist"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <CheckCircle2 size={15} />
            Pre-Publication Checklist
          </button>
        </div>

        {/* Tab 1: Live Notice Scanner */}
        {activeTab === "scanner" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Dropzone */}
              <Reveal>
                <div className="card flex h-full min-h-[300px] flex-col items-center justify-center border-dashed border-white/20 p-8 text-center transition hover:border-white/40">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <UploadCloud size={28} className="text-fg" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">Drop College Notice (PDF or DOCX)</h3>
                  <p className="mt-1.5 max-w-sm text-xs text-muted">
                    DarkSpot Atlas parses all date clauses, eligibility criteria, and fee deadlines, matching them against central statutory ordinances.
                  </p>
                  
                  {selectedFileName ? (
                    <div className="mt-5 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-mono text-fg flex items-center gap-2">
                      <FileText size={14} className="text-emerald-400" />
                      <span>{selectedFileName}</span>
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => handleSimulateScan("Hostel_Refund_Bylaw_2026.pdf")}
                        className="btn-primary text-xs"
                      >
                        Upload Circular
                      </button>
                      <span className="text-xs text-subtle">or test with sample below</span>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 animate-pulse font-mono">
                      <Sparkles size={13} />
                      Cross-referencing statutory ordinances...
                    </div>
                  )}

                  {scanComplete && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                      <CheckCircle2 size={13} />
                      Audit Complete: 2 contradictory clauses found.
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Sample Circular Selector */}
              <Reveal delay={0.1}>
                <div className="card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Pre-loaded College Notice Samples</div>
                      <div className="text-xs text-muted">Click any document to run an automated gap audit</div>
                    </div>
                    <span className="badge">1-Click Test</span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleSimulateScan("Hostel_Fee_Refund_Notice_412.pdf")}
                      className="w-full text-left rounded-xl border border-line bg-card/50 p-3.5 transition hover:border-white/30 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-fg">Hostel Fee Refund & Caution Deposit</span>
                        <span className="badge text-[10px] text-red-400 border-red-500/30">UGC Conflict</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted line-clamp-1">
                        Notice states caution deposit non-refundable after Day 15; contradicts central UGC gazette.
                      </p>
                    </button>

                    <button
                      onClick={() => handleSimulateScan("Exam_Attendance_Waiver_Notice.pdf")}
                      className="w-full text-left rounded-xl border border-line bg-card/50 p-3.5 transition hover:border-white/30 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-fg">Semester End Exam Attendance Cutoff</span>
                        <span className="badge text-[10px] text-amber-400 border-amber-500/30">Statute Drift</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted line-clamp-1">
                        Omits statutory medical waiver clause §18.B, triggering student appeals.
                      </p>
                    </button>

                    <button
                      onClick={() => handleSimulateScan("NSP_Scholarship_Verification_2026.pdf")}
                      className="w-full text-left rounded-xl border border-line bg-card/50 p-3.5 transition hover:border-white/30 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-fg">NSP Merit Scholarship Institute Verification</span>
                        <span className="badge text-[10px] text-red-400 border-red-500/30">Deadline Clash</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted line-clamp-1">
                        Claims portal closes Oct 31, but MoE nationwide extension grants until Nov 15.
                      </p>
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Live Scan Results Banner */}
            <div className="card p-6 border-white/20 bg-gradient-to-r from-card to-white/[0.03]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted">Audited Ordinance Corpus</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold">
                    Live Statutory Corpus: 18,420 Government & University Ordinances Indexed
                  </h4>
                  <p className="mt-0.5 text-xs text-muted">
                    Includes UGC (Mandate 2026), AICTE Regulations, National Scholarship Portal guidelines, and State University Statutes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("conflicts")}
                  className="btn-primary text-xs shrink-0 inline-flex items-center gap-1.5"
                >
                  View Discrepancy Matrix <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Discrepancy Matrix */}
        {activeTab === "conflicts" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-subtle mb-1">
                Detected Discrepancies ({sampleDiscrepancies.length})
              </div>
              {sampleDiscrepancies.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDiscrepancy(d)}
                  className={`card cursor-pointer p-4 transition ${
                    selectedDiscrepancy.id === d.id
                      ? "border-white bg-white/[0.05]"
                      : "hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-subtle">{d.category}</span>
                    <span
                      className={`badge text-[10px] uppercase font-mono ${
                        d.severity === "critical"
                          ? "border-red-500/40 text-red-400"
                          : d.severity === "warning"
                          ? "border-amber-500/40 text-amber-400"
                          : "border-blue-500/40 text-blue-400"
                      }`}
                    >
                      {d.severity}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-fg">{d.title}</div>
                  <div className="mt-2 text-xs text-muted line-clamp-2">
                    {d.noticeExcerpt}
                  </div>
                </div>
              ))}
            </div>

            {/* Side-by-side Evidence Box */}
            <div className="lg:col-span-7">
              <div className="card p-6">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-muted">
                      {selectedDiscrepancy.category}
                    </span>
                    <h3 className="mt-1 text-base font-semibold">{selectedDiscrepancy.title}</h3>
                  </div>
                  <span
                    className={`badge text-xs uppercase font-mono ${
                      selectedDiscrepancy.severity === "critical"
                        ? "border-red-500/40 text-red-400"
                        : "border-amber-500/40 text-amber-400"
                    }`}
                  >
                    {selectedDiscrepancy.severity}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Notice side */}
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="flex items-center justify-between text-xs text-red-400 font-medium">
                      <span>College Notice Text</span>
                      <span className="font-mono text-[10px]">{selectedDiscrepancy.noticeSource}</span>
                    </div>
                    <blockquote className="mt-2 border-l-2 border-red-500/50 pl-3 text-xs italic text-fg/90">
                      &ldquo;{selectedDiscrepancy.noticeExcerpt}&rdquo;
                    </blockquote>
                  </div>

                  {/* Reference side */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                      <span>Statutory Regulation / Benchmark</span>
                      <span className="font-mono text-[10px]">{selectedDiscrepancy.referenceSource}</span>
                    </div>
                    <blockquote className="mt-2 border-l-2 border-emerald-500/50 pl-3 text-xs italic text-fg/90">
                      &ldquo;{selectedDiscrepancy.referenceExcerpt}&rdquo;
                    </blockquote>
                  </div>

                  {/* Remediation */}
                  <div className="rounded-xl border border-line bg-card/70 p-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Sparkles size={13} className="text-fg" /> Suggested Remediation for Registrar
                    </div>
                    <p className="mt-2 text-xs text-fg leading-relaxed">
                      {selectedDiscrepancy.remediation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-subtle">
                      Audit Hash: 0x7c92b...a10f • Confidence: 99.4%
                    </span>
                    <button
                      onClick={() => alert("Official Addendum Draft exported to clipboard.")}
                      className="btn-ghost text-xs"
                    >
                      Export Addendum Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Confusion Radar */}
        {activeTab === "confusion" && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-semibold">Student Confusion Index by Department</h3>
                  <p className="text-xs text-muted">
                    Derived from student queries, grievance tickets, and repeated verification clicks under strict $k$-anonymity ($k \ge 10$).
                  </p>
                </div>
                <div className="badge border-emerald-500/30 text-emerald-400 text-xs">
                  Differential Privacy: Active
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {confusionDepartments.map((d) => (
                  <div key={d.dept} className="rounded-xl border border-line bg-card/60 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold">{d.dept}</div>
                        <div className="text-xs text-muted mt-0.5">
                          Top friction source: <span className="text-fg">{d.primaryGap}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-muted">Confusion Score</div>
                          <div className="text-sm font-mono font-semibold">{d.score}/100</div>
                        </div>
                        <span
                          className={`badge text-xs ${
                            d.score > 85
                              ? "border-red-500/40 text-red-400"
                              : d.score > 70
                              ? "border-amber-500/40 text-amber-400"
                              : "border-emerald-500/40 text-emerald-400"
                          }`}
                        >
                          {d.score > 85 ? "High Friction" : d.score > 70 ? "Moderate" : "Nominal"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-line overflow-hidden">
                      <div
                        className={`h-full ${
                          d.score > 85 ? "bg-red-400" : d.score > 70 ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pre-Publication Checklist */}
        {activeTab === "checklist" && (
          <div className="card p-6 max-w-3xl mx-auto">
            <div className="border-b border-line pb-4">
              <h3 className="text-base font-semibold">Registrar Pre-Publication Verification Checklist</h3>
              <p className="text-xs text-muted mt-1">
                Ensure every circular clears these 5 automated statutory criteria before publishing to student boards.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { title: "Statutory Refund Window", desc: "Verifies UGC 2026 refund timelines (100% within 30 days) are explicitly honored.", pass: true },
                { title: "Definite Calendar Cutoffs", desc: "No ambiguous phrasing like 'shortly' or 'subject to approval'. Specific calendar dates provided.", pass: true },
                { title: "Appeals & Remediation Authority", desc: "Designates an official contact designation (e.g. Dean Student Welfare) with grievance window.", pass: true },
                { title: "Superseded Circular Explicit Revocation", desc: "Explicitly invalidates prior conflicting circular numbers to prevent student misinterpretation.", pass: false },
                { title: "Cryptographic Registrar Timestamp", desc: "Attaches a verifiable digital signature or authenticated hash for tamper prevention.", pass: true }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-line p-4 bg-card/60">
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.pass ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {item.pass ? <Check size={12} strokeWidth={3} /> : <AlertTriangle size={12} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{item.title}</span>
                      <span className={`badge text-[10px] ${item.pass ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"}`}>
                        {item.pass ? "Passes Audit" : "Requires Attention"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
