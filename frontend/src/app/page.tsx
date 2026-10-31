'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CircleDashed, 
  ArrowLeftRight, 
  Clock, 
  Check, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Layers,
  CheckCircle2,
  ListFilter,
  Plus,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Finding, AnalysisResult, ChecklistItem } from '../lib/types';
import { streamAnalyzeTopic } from '../lib/api';
import { EvidenceSheet } from '../components/EvidenceSheet';
import { HeatmapMatrix } from '../components/HeatmapMatrix';
import { VerifyChecklist } from '../components/VerifyChecklist';
import { AnimatedTicker } from '../components/AnimatedTicker';

// High-fidelity fallback result matching Image 4
const DEFAULT_SAMPLE_RESULT: AnalysisResult = {
  id: 'nsp-audit-sample',
  question: 'What should I verify before applying for this scholarship?',
  topic_type: 'scholarship',
  coverage: 0.62,
  dsi: 0.38,
  summary_counts: {
    gaps: 4,
    conflicts: 2,
    outdated: 1,
    sourced_facts: 3,
  },
  sources: [
    { url: 'https://scholarships.gov.in/guidelines.pdf', domain: 'scholarships.gov.in', tier: 1.0, trust: 0.95 },
    { url: 'https://stateportal.gov.in/scheme', domain: 'stateportal.gov.in', tier: 0.9, trust: 0.88 },
    { url: 'https://buddy4study.com/nsp-info', domain: 'buddy4study.com', tier: 0.3, trust: 0.45 },
  ],
  findings: [
    {
      type: 'gap',
      attribute: 'renewal',
      statement: 'Renewal conditions are not found in the reviewed sources.',
      evidence: [],
      confidence: 0.95,
      label: 'not_found_in_reviewed_sources',
      severity: 0.7,
    },
    {
      type: 'conflict',
      attribute: 'documents',
      statement: 'Income document differs between sources: Source A requires an Income Certificate, whereas Source B accepts an Affidavit.',
      evidence: [
        {
          source_url: 'https://scholarships.gov.in/guidelines.pdf',
          source_domain: 'scholarships.gov.in',
          quote: 'Income certificate issued by the designated competent revenue authority (Tahsildar) is mandatory.',
          value: 'Income Certificate',
          trust: 0.95,
          location: 'Page 3, Section 4.2',
        },
        {
          source_url: 'https://buddy4study.com/nsp-info',
          source_domain: 'buddy4study.com',
          quote: 'Self-declaration income affidavit on non-judicial stamp paper can be submitted for initial registration.',
          value: 'Income Affidavit',
          trust: 0.45,
          location: 'Paragraph 6',
        },
      ],
      confidence: 0.92,
      label: 'potential',
      severity: 0.85,
      resolution_hint: 'Official NSP PDF (Trust: 95%) takes precedence over coaching portal.',
    },
    {
      type: 'outdated',
      attribute: 'deadline',
      statement: 'Deadline may be outdated: Page refers to the 2023–24 academic cycle instead of current year.',
      evidence: [
        {
          source_url: 'https://stateportal.gov.in/scheme',
          source_domain: 'stateportal.gov.in',
          quote: 'Last date for online submission for cycle 2023-24 is 30th November 2023.',
          location: 'Notice Banner',
          source_trust: 0.88,
        },
      ],
      confidence: 0.88,
      label: 'potential',
      severity: 0.9,
    },
    {
      type: 'gap',
      attribute: 'helpline',
      statement: 'Toll-free student grievance helpline number is missing across reviewed sources.',
      evidence: [],
      confidence: 0.9,
      label: 'not_found_in_reviewed_sources',
      severity: 0.4,
    },
    {
      type: 'sourced_fact',
      attribute: 'eligibility',
      statement: 'Family annual income must not exceed ₹2.5 Lakh from all sources.',
      evidence: [
        {
          source_url: 'https://scholarships.gov.in/guidelines.pdf',
          source_domain: 'scholarships.gov.in',
          quote: 'Total annual family income of the candidate from all sources should not exceed Rs. 2,50,000/-.',
          location: 'Eligibility Clause 2.1',
          source_trust: 0.95,
        },
      ],
      confidence: 0.98,
      label: 'sourced_fact',
      severity: 0.1,
    },
  ],
  checklist: [
    {
      action: 'Confirm current academic cycle deadline from latest official NSP circular.',
      finding_attribute: 'deadline',
      priority_score: 0.85,
      priority: 'High',
      link: 'https://scholarships.gov.in',
      done: false,
    },
    {
      action: 'Verify whether Tahsildar Income Certificate is mandatory or if Affidavit is accepted.',
      finding_attribute: 'documents',
      priority_score: 0.78,
      priority: 'High',
      link: 'https://scholarships.gov.in',
      done: false,
    },
    {
      action: 'Search official institute portal for renewal criteria for 2nd year students.',
      finding_attribute: 'renewal',
      priority_score: 0.52,
      priority: 'Medium',
      link: 'https://scholarships.gov.in',
      done: false,
    },
    {
      action: 'Confirm official helpline email support on the official portal.',
      finding_attribute: 'helpline',
      priority_score: 0.25,
      priority: 'Low',
      link: 'https://scholarships.gov.in',
      done: false,
    },
  ],
  heatmap: [
    {
      attribute: 'eligibility',
      sources: [
        { source_domain: 'scholarships.gov.in', covered: true, trust: 0.95 },
        { source_domain: 'stateportal.gov.in', covered: true, trust: 0.88 },
        { source_domain: 'buddy4study.com', covered: true, trust: 0.45 },
      ],
    },
    {
      attribute: 'deadline',
      sources: [
        { source_domain: 'scholarships.gov.in', covered: true, trust: 0.95 },
        { source_domain: 'stateportal.gov.in', covered: true, trust: 0.88 },
        { source_domain: 'buddy4study.com', covered: false, trust: 0.45 },
      ],
    },
    {
      attribute: 'documents',
      sources: [
        { source_domain: 'scholarships.gov.in', covered: true, trust: 0.95 },
        { source_domain: 'stateportal.gov.in', covered: true, trust: 0.88 },
        { source_domain: 'buddy4study.com', covered: true, trust: 0.45 },
      ],
    },
    {
      attribute: 'renewal',
      sources: [
        { source_domain: 'scholarships.gov.in', covered: false, trust: 0.95 },
        { source_domain: 'stateportal.gov.in', covered: false, trust: 0.88 },
        { source_domain: 'buddy4study.com', covered: false, trust: 0.45 },
      ],
    },
    {
      attribute: 'helpline',
      sources: [
        { source_domain: 'scholarships.gov.in', covered: false, trust: 0.95 },
        { source_domain: 'stateportal.gov.in', covered: false, trust: 0.88 },
        { source_domain: 'buddy4study.com', covered: false, trust: 0.45 },
      ],
    },
  ],
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentProgress, setAgentProgress] = useState<{ step: string; detail: string }[]>([]);
  const [result, setResult] = useState<AnalysisResult>(DEFAULT_SAMPLE_RESULT);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(DEFAULT_SAMPLE_RESULT.findings[1]);
  const [activeTab, setActiveTab] = useState<'all' | 'gaps' | 'conflicts' | 'outdated' | 'facts' | 'heatmap'>('all');

  const exampleTopics = [
    'National Scholarship Portal Post-Matric Scholarship eligibility and deadline',
    'UGC Ishan Uday Scholarship guidelines & renewal rules',
    'Pradhan Mantri Awas Yojana (PMAY-G) income limit & documents',
    'JoSAA Counselling seat acceptance fee & original document requirements',
  ];

  const handleStartAnalysis = (topicText?: string) => {
    const q = topicText || query;
    if (!q.trim()) return;

    setIsAnalyzing(true);
    setAgentProgress([]);
    setSelectedFinding(null);

    streamAnalyzeTopic(
      q.trim(),
      customUrls,
      (step, detail) => {
        setAgentProgress((prev) => [...prev, { step, detail }]);
      },
      (completedResult) => {
        setResult(completedResult);
        setIsAnalyzing(false);
        if (completedResult.findings.length > 0) {
          setSelectedFinding(completedResult.findings[0]);
        }
      },
      (err) => {
        console.error('Analysis error:', err);
        setIsAnalyzing(false);
      }
    );
  };

  const addUrl = () => {
    if (urlInput.trim() && !customUrls.includes(urlInput.trim())) {
      setCustomUrls((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const removeUrl = (idx: number) => {
    setCustomUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // Filter findings based on active tab
  const filteredFindings = result.findings.filter((f) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'gaps') return f.type === 'gap' || f.label === 'not_found_in_reviewed_sources';
    if (activeTab === 'conflicts') return f.type === 'conflict';
    if (activeTab === 'outdated') return f.type === 'outdated';
    if (activeTab === 'facts') return f.type === 'sourced_fact';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F10] text-[#F4F4F5] bg-dot-grid">
      
      {/* Live Scrolling Audit Ticker */}
      <AnimatedTicker />

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">

        {/* Hero & Query Input Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181A] border border-[#2C2C30] text-xs text-[#9A9AA2]">
            <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            <span>Multi-Agent AI Information Gap & Conflict Auditor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Jahan jaankari mein andhera hai, <br className="hidden sm:inline" />
            <span className="text-[#9A9AA2] font-normal">wahan roshni.</span>
          </h1>

          <p className="text-sm text-[#9A9AA2] max-w-xl mx-auto leading-relaxed">
            Enter any scholarship, admission, or government scheme. Our autonomous multi-agent pipeline audits multiple sources simultaneously to find missing gaps, conflicting rules, and outdated circulars.
          </p>

          {/* Search Box Card */}
          <div className="pt-2">
            <div className="bg-[#18181A] p-2 rounded-2xl border border-[#2C2C30] shadow-2xl focus-within:border-[#3E3E44] transition-all">
              <div className="flex items-center gap-3 px-3 py-1.5">
                <Search className="w-5 h-5 text-[#9A9AA2]" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Ask a question or enter a policy topic (e.g., NSP Post-Matric Scholarship rules)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartAnalysis()}
                  className="w-full bg-transparent text-sm sm:text-base text-[#F4F4F5] placeholder-[#6B6B76] focus:outline-none"
                />
                <button
                  onClick={() => handleStartAnalysis()}
                  disabled={isAnalyzing}
                  className="h-10 px-5 rounded-xl bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-sm font-semibold flex items-center gap-2 transition-all flex-shrink-0 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </>
                  )}
                </button>
              </div>

              {/* Optional Custom URLs toggle */}
              <div className="px-3 pt-2 pb-1 flex items-center justify-between text-xs text-[#6B6B76] border-t border-[#232326] mt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="hover:text-[#9A9AA2] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{showUrlField ? 'Hide URL inputs' : '+ Add specific URLs or PDFs'}</span>
                </button>
                <span>Permitted real search active</span>
              </div>

              {/* Expanded URL Inputs */}
              {showUrlField && (
                <div className="p-3 bg-[#0F0F10] rounded-xl border border-[#232326] mt-2 text-left space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste specific official portal URL (e.g. https://scholarships.gov.in)..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                      className="flex-1 bg-[#18181A] border border-[#2C2C30] rounded-lg px-3 py-1.5 text-xs text-[#F4F4F5] placeholder-[#6B6B76] focus:outline-none"
                    />
                    <button
                      onClick={addUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#2C2C30] hover:bg-[#3E3E44] text-xs text-white"
                    >
                      Add
                    </button>
                  </div>

                  {customUrls.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {customUrls.map((u, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#18181A] border border-[#2C2C30] text-[11px] text-[#9A9AA2] flex items-center gap-1.5">
                          <span className="truncate max-w-[200px]">{u}</span>
                          <button onClick={() => removeUrl(i)} className="text-[#6B6B76] hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-[#6B6B76]">Try audited examples:</span>
              {exampleTopics.map((top, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(top);
                    handleStartAnalysis(top);
                  }}
                  className="px-3 py-1 rounded-full bg-[#18181A] hover:bg-[#1F1F22] border border-[#2C2C30] hover:border-[#3E3E44] text-xs text-[#9A9AA2] hover:text-white transition-all truncate max-w-xs"
                >
                  {top.split(' ')[0]} {top.split(' ')[1]} {top.split(' ')[2]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live SSE Multi-Agent Progress Streamer */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto bg-[#18181A] border border-[#2C2C30] rounded-xl p-5 shadow-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-[#9A9AA2] pb-2 border-b border-[#2C2C30]">
              <span className="flex items-center gap-2 font-medium text-white">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" strokeWidth={1.5} />
                Multi-Agent Coordination in Progress...
              </span>
              <span className="font-mono-code">{agentProgress.length} steps executed</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono-code text-xs">
              {agentProgress.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#9A9AA2]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                  <span className="text-[#6B6B76] uppercase text-[10px] w-32 truncate">[{p.step}]</span>
                  <span className="text-[#F4F4F5] truncate">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS WORKSPACE (Matches Image 4 UI Reference) */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Report Header Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#6B6B76] uppercase tracking-wider font-mono-code">
                AUDITED REPORT
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {result.question}
              </h2>
            </div>

            {/* Top Metric Strip Cards (Image 4 exact cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
              
              {/* Coverage Card */}
              <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-4 sm:p-5">
                <div className="text-xs text-[#9A9AA2] mb-1 font-medium">Coverage</div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {(result.coverage * 100).toFixed(0)}%
                </div>
                <div className="text-[11px] text-[#6B6B76] mt-1">Verified Information</div>
              </div>

              {/* Gaps Card */}
              <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-4 sm:p-5">
                <div className="text-xs text-[#9A9AA2] mb-1 font-medium">Gaps</div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {result.summary_counts.gaps}
                </div>
                <div className="text-[11px] text-[#6B6B76] mt-1">Missing Attributes</div>
              </div>

              {/* Conflicts Card */}
              <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-4 sm:p-5">
                <div className="text-xs text-[#9A9AA2] mb-1 font-medium">Conflicts</div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {result.summary_counts.conflicts}
                </div>
                <div className="text-[11px] text-[#6B6B76] mt-1">Opposing Statements</div>
              </div>

              {/* Outdated Card */}
              <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-4 sm:p-5">
                <div className="text-xs text-[#9A9AA2] mb-1 font-medium">Outdated</div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {result.summary_counts.outdated}
                </div>
                <div className="text-[11px] text-[#6B6B76] mt-1">Expired / Purani Info</div>
              </div>

              {/* Dark Spot Index (DSI) */}
              <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-4 sm:p-5 col-span-2 sm:col-span-4 lg:col-span-1">
                <div className="text-xs text-[#9A9AA2] mb-1 font-medium">Dark Spot Index</div>
                <div className="text-3xl font-bold text-white tracking-tight">
                  {(result.dsi * 100).toFixed(0)}%
                </div>
                <div className="text-[11px] text-[#6B6B76] mt-1">DSI = 1 − Coverage</div>
              </div>

            </div>

            {/* Filter Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-[#2C2C30] pb-2 overflow-x-auto text-xs font-medium">
              {[
                { id: 'all', label: 'All Findings' },
                { id: 'gaps', label: `Potential Gaps (${result.summary_counts.gaps})` },
                { id: 'conflicts', label: `Conflicts (${result.summary_counts.conflicts})` },
                { id: 'outdated', label: `Outdated (${result.summary_counts.outdated})` },
                { id: 'facts', label: `Sourced Facts (${result.summary_counts.sourced_facts})` },
                { id: 'heatmap', label: 'Coverage Heatmap (F12)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-[#0F0F10] font-semibold'
                      : 'text-[#9A9AA2] hover:text-white hover:bg-[#18181A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content Layout (2-Column Grid: Left Findings / Right Evidence Sheet) */}
            {activeTab === 'heatmap' ? (
              <HeatmapMatrix
                heatmap={result.heatmap}
                onSelectAttribute={(attr) => {
                  const match = result.findings.find((f) => f.attribute === attr);
                  if (match) setSelectedFinding(match);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Finding Cards List (7 Cols) */}
                <div className="lg:col-span-7 space-y-3">
                  {filteredFindings.length === 0 ? (
                    <div className="p-8 text-center bg-[#18181A] border border-[#2C2C30] rounded-xl text-xs text-[#9A9AA2]">
                      No findings in this category.
                    </div>
                  ) : (
                    filteredFindings.map((finding, idx) => {
                      const isSelected = selectedFinding === finding;
                      const isGap = finding.type === 'gap' || finding.label === 'not_found_in_reviewed_sources';
                      const isConflict = finding.type === 'conflict';
                      const isOutdated = finding.type === 'outdated';

                      // Specific border styles based on Blueprint:
                      // Gap = Dashed border; Conflict = Solid strong border; Outdated = Dotted border
                      const borderStyle = isGap
                        ? 'border-dashed border-[#3E3E44]'
                        : isConflict
                        ? 'border-solid border-[#404040]'
                        : isOutdated
                        ? 'border-dotted border-[#3E3E44]'
                        : 'border-[#2C2C30]';

                      const Icon = isGap ? CircleDashed : isConflict ? ArrowLeftRight : isOutdated ? Clock : Check;

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedFinding(finding)}
                          className={`p-4 sm:p-5 rounded-xl transition-all cursor-pointer select-none bg-[#18181A] hover:bg-[#1F1F22] border ${borderStyle} ${
                            isSelected ? 'ring-2 ring-white/80 bg-[#1F1F22]' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Icon className="w-4 h-4 text-[#9A9AA2] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                              <div>
                                <h4 className="text-sm font-semibold text-[#F4F4F5] capitalize">
                                  {finding.attribute.replace('_', ' ')}
                                </h4>
                                <p className="text-xs text-[#9A9AA2] mt-1 leading-relaxed">
                                  {finding.statement}
                                </p>
                              </div>
                            </div>

                            {/* Badge */}
                            <span
                              className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                                isConflict
                                  ? 'bg-white text-[#0F0F10] font-semibold'
                                  : isGap
                                  ? 'border border-dashed border-[#6B6B76] text-[#9A9AA2]'
                                  : 'bg-[#1F1F22] border border-[#2C2C30] text-[#9A9AA2]'
                              }`}
                            >
                              {finding.type === 'conflict' ? 'Conflict' : finding.type === 'outdated' ? 'Outdated' : 'Potential gap'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Column: Sticky Evidence Sheet Panel (5 Cols - Image 4) */}
                <div className="lg:col-span-5">
                  <EvidenceSheet finding={selectedFinding} />
                </div>

              </div>
            )}

            {/* Bottom: Verify-Next Action Planner (F11) */}
            <div className="pt-4">
              <VerifyChecklist items={result.checklist} topicTitle={result.question} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
