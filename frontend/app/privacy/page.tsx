import PageHeader from "@/components/PageHeader";
import { ShieldCheck, Lock, EyeOff, FileText, Database } from "lucide-react";

export default function Privacy() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="PRIVACY CHARTER"
        title="Privacy & Data Governance Charter"
        sub="Our mathematical commitment to zero-data monetization, cryptographic verification anonymity, and verifiable student data sovereignty."
      />

      <div className="mx-auto max-w-4xl space-y-8 px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <ShieldCheck size={20} className="text-white" />
            <div className="mt-3 text-sm font-semibold">Zero Data Monetization</div>
            <p className="mt-1 text-xs text-muted">We never sell, rent, or commercialize student queries or institutional circulars.</p>
          </div>
          <div className="card p-5">
            <Lock size={20} className="text-blue-400" />
            <div className="mt-3 text-sm font-semibold">k ≥ 10 Differential Privacy</div>
            <p className="mt-1 text-xs text-muted">Officer confusion telemetry suppresses any cluster smaller than 10 citizens to prevent re-identification.</p>
          </div>
          <div className="card p-5">
            <EyeOff size={20} className="text-purple-400" />
            <div className="mt-3 text-sm font-semibold">Zero LLM Training on Data</div>
            <p className="mt-1 text-xs text-muted">Your uploaded circulars and queries are never utilized to fine-tune third-party generative models.</p>
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-fg">1. What Information We Process</h3>
            <p className="text-xs text-muted leading-relaxed">
              When you initiate an analysis on DarkSpot Atlas, we process the specific query text and canonical URLs you provide. For campus notices uploaded via PDF or image OCR, documents are parsed in ephemeral memory buffers solely for entity extraction, date clause alignment, and mathematical contradiction auditing.
            </p>
          </section>

          <section className="space-y-2 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-fg">2. Confusion Intelligence Anonymization Standard</h3>
            <p className="text-xs text-muted leading-relaxed">
              DarkSpot Atlas assists public officers and university deans in understanding where citizens get stuck. To safeguard student privacy, all confusion metrics utilize provable $k$-anonymity ($k \ge 10$) combined with Laplacian differential privacy noise. If fewer than 10 students in a district or department encounter a specific clause, that data point is strictly suppressed from all officer dashboards.
            </p>
          </section>

          <section className="space-y-2 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-fg">3. Cryptographic Storage & Third-Party APIs</h3>
            <p className="text-xs text-muted leading-relaxed">
              Public web search requests are routed through Tavily API strictly over TLS 1.3 encrypted connections with domain whitelists restricted to official government (.gov, .nic, .ac) and institutional domains. Extracted text is audited using private instances of Google Gemini Flash with data retention explicitly disabled.
            </p>
          </section>

          <section className="space-y-2 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-fg">4. User Rights & Complete Data Erasure</h3>
            <p className="text-xs text-muted leading-relaxed">
              Under global data sovereignty principles and Indian Digital Personal Data Protection (DPDP) Act compliance, you retain full rights to export your audit dossier at any time in standard JSON format, or trigger an irreversible purge of your account and all associated audit reports via Settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
