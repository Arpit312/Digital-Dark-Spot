import PageHeader from "@/components/PageHeader";
import { FileCheck2, AlertCircle, Scale, ShieldAlert } from "lucide-react";

export default function Terms() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="LEGAL TERMS"
        title="Terms of Service & Audit Integrity"
        sub="The operational framework governing our verification signals, algorithmic limitations, and official source confirmation requirements."
      />

      <div className="mx-auto max-w-4xl space-y-8 px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <Scale size={20} className="text-white" />
            <div className="mt-3 text-sm font-semibold">Independent Verification</div>
            <p className="mt-1 text-xs text-muted">Findings provide mathematical signals to assist human verification, not statutory replacements.</p>
          </div>
          <div className="card p-5">
            <FileCheck2 size={20} className="text-blue-400" />
            <div className="mt-3 text-sm font-semibold">Source Transparency</div>
            <p className="mt-1 text-xs text-muted">All claims link directly to the underlying official source text with exact character offset proof.</p>
          </div>
          <div className="card p-5">
            <ShieldAlert size={20} className="text-purple-400" />
            <div className="mt-3 text-sm font-semibold">Public Authority Notice</div>
            <p className="mt-1 text-xs text-muted">Designated government officers may publish authoritative addenda to supersede ambiguous notices.</p>
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <section className="space-y-2">
            <h3 className="text-base font-semibold text-fg">1. Nature of Automated Audit Findings</h3>
            <p className="text-xs text-muted leading-relaxed">
              DarkSpot Atlas generates comparative intelligence by cross-referencing public government websites, official gazettes, and campus notifications. While our 8-agent consensus pipeline executes strict zero-hallucination checks (Quote_match = 1.0), users are advised that automated reports serve as actionable guidance to verify with official nodal authorities prior to critical administrative cutoffs.
            </p>
          </section>

          <section className="space-y-2 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-fg">2. User-Supplied Sources & Circulars</h3>
            <p className="text-xs text-muted leading-relaxed">
              When submitting custom source URLs or uploading institutional PDFs for auditing, you warrant that these documents are public administrative notices or documents you are lawfully authorized to review. You agree not to upload confidential, personally identifiable, or state-classified materials.
            </p>
          </section>

          <section className="space-y-2 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-fg">3. Officer Multi-Signature Governance</h3>
            <p className="text-xs text-muted leading-relaxed">
              Official clarifications issued through the Officer Console require cryptographic multi-signature authentication. Any clarification signed by a verified public authority carries institutional authority within the DarkSpot Atlas trust registry and immediately updates consumer-facing contradiction signals.
            </p>
          </section>

          <section className="space-y-2 border-t border-line pt-6">
            <h3 className="text-base font-semibold text-fg">4. System Availability & Service Levels</h3>
            <p className="text-xs text-muted leading-relaxed">
              DarkSpot Atlas is developed to safeguard citizen welfare and student rights. The service is provided on an &ldquo;as is&rdquo; basis with continuous uptime monitoring. Programmatic API access is subject to fair-use rate limiting to ensure equitable throughput across educational institutions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
