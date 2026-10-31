"use client";

import { useState } from "react";
import {
  Sliders,
  Shield,
  Bell,
  Download,
  Trash2,
  CheckCircle2,
  Key,
  Globe,
  Eye
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Seg, Toggle } from "@/components/ui";

function SettingRow({
  title,
  desc,
  control
}: {
  title: string;
  desc: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-line py-5 first:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-md">
        <div className="text-sm font-medium text-fg">{title}</div>
        <div className="text-xs text-muted mt-0.5">{desc}</div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export default function Settings() {
  const [lang, setLang] = useState("English");
  const [zeroHallucinationStrict, setZeroHallucinationStrict] = useState(true);
  const [changeAlerts, setChangeAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [temporalHorizon, setTemporalHorizon] = useState("90 Days");
  const [redTeamPasses, setRedTeamPasses] = useState("Deep (6 passes)");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="CONFIGURATION"
        title="Settings & Audit Thresholds"
        sub="Configure pipeline guardrail strictness, zero-hallucination verification tolerances, and real-time alerts."
      />

      <div className="mx-auto max-w-4xl space-y-8 px-5 py-8">
        {savedNotice && (
          <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-xs font-mono text-white flex items-center gap-2">
            <CheckCircle2 size={14} className="text-white" /> Preferences and audit thresholds saved to local configuration.
          </div>
        )}

        {/* Section 1: AI Model & Guardrail Thresholds */}
        <div className="card p-6">
          <div className="flex items-center gap-2 border-b border-line pb-4 mb-4">
            <Shield size={16} className="text-white" />
            <h3 className="text-base font-semibold">AI Verification & Guardrails</h3>
          </div>

          <SettingRow
            title="Zero-Hallucination Exact Substring Gate"
            desc="Enforce 100% verbatim substring offset matching in source text. Discard any finding failing exact character alignment."
            control={
              <Toggle
                on={zeroHallucinationStrict}
                onChange={setZeroHallucinationStrict}
                label="Strict Substring Matching"
              />
            }
          />

          <SettingRow
            title="Temporal Decay Horizon"
            desc="Flag public guidelines as potentially outdated if published earlier than this horizon."
            control={
              <Seg
                id="temporal"
                value={temporalHorizon}
                onChange={setTemporalHorizon}
                options={["30 Days", "90 Days", "180 Days"]}
              />
            }
          />

          <SettingRow
            title="Bayesian Adversarial Red-Team Depth"
            desc="Number of falsification iterations executed by Agent 06 before confirming a contradiction."
            control={
              <Seg
                id="redteam"
                value={redTeamPasses}
                onChange={setRedTeamPasses}
                options={["Standard (3 passes)", "Deep (6 passes)"]}
              />
            }
          />
        </div>

        {/* Section 2: Localization & Motion */}
        <div className="card p-6">
          <div className="flex items-center gap-2 border-b border-line pb-4 mb-4">
            <Globe size={16} className="text-blue-400" />
            <h3 className="text-base font-semibold">Language & Interface Experience</h3>
          </div>

          <SettingRow
            title="Primary Language"
            desc="Select default language for generated audit checklists and quote explanations."
            control={
              <Seg
                id="lang"
                value={lang}
                onChange={setLang}
                options={["English", "हिन्दी"]}
              />
            }
          />

          <SettingRow
            title="Reduce Motion & Animations"
            desc="Disables high-refresh canvas parallax effects and page transitions."
            control={
              <Toggle
                on={reduceMotion}
                onChange={setReduceMotion}
                label="Reduce motion"
              />
            }
          />
        </div>

        {/* Section 3: Alerts & Webhooks */}
        <div className="card p-6">
          <div className="flex items-center gap-2 border-b border-line pb-4 mb-4">
            <Bell size={16} className="text-amber-400" />
            <h3 className="text-base font-semibold">Notifications & Tracked Source Alerts</h3>
          </div>

          <SettingRow
            title="Source Drift Alerts"
            desc="Receive instant notifications whenever a tracked government portal or circular changes text content."
            control={
              <Toggle
                on={changeAlerts}
                onChange={setChangeAlerts}
                label="Change alerts"
              />
            }
          />

          <SettingRow
            title="Deadline Critical Reminders"
            desc="Alert 72 hours and 24 hours prior to verified scheme application deadlines."
            control={
              <Toggle
                on={deadlineReminders}
                onChange={setDeadlineReminders}
                label="Deadline reminders"
              />
            }
          />
        </div>

        {/* Section 4: Data Management & Export */}
        <div className="card p-6">
          <div className="flex items-center gap-2 border-b border-line pb-4 mb-4">
            <Download size={16} className="text-purple-400" />
            <h3 className="text-base font-semibold">Data Sovereignty & Account</h3>
          </div>

          <SettingRow
            title="Export Audit Dossier"
            desc="Download all generated analysis reports, quote offsets, and evidence tables in JSON format."
            control={
              <button
                onClick={() => alert("Audit history export initiated (DarkSpot_Audit_Dossier.json).")}
                className="btn-ghost text-xs"
              >
                Export JSON
              </button>
            }
          />

          <SettingRow
            title="Purge Local Session & Cache"
            desc="Clear all locally cached SSE tokens, un-submitted queries, and indexed preview documents."
            control={
              <button
                onClick={() => {
                  localStorage.clear();
                  alert("Local cache purged.");
                }}
                className="btn-ghost text-xs text-red-400 hover:text-red-300"
              >
                Purge Cache
              </button>
            }
          />
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary px-6 py-2.5 text-xs">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
