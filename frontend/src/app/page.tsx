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
  FileText,
  Radio,
  Globe,
  TrendingDown,
  Activity,
  Maximize2
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
    <div className="flex-1 flex flex-col text-[#F4F4F5] relative">
      
      {/* Real Continuous Sliding Tickers */}
      <AnimatedTicker />

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">

        {/* Hero & Query Input Section */}
        <div className="max-w-3xl mx-auto text-center space-y-5 relative">
          
          {/* Subtle Ambient Radial Light behind Hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.03] blur-[120px] pointer-events-none" />

          {/* Top Protocol Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141416]/90 border border-[#27272A] text-xs text-[#A1A1AA] shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono-code text-[11px] text-[#F4F4F5]">DARKS-POT MULTI-AGENT ENGINE</span>
            <span className="text-[#3F3F46]">•</span>
            <span className="text-white font-medium">18 Deterministic Algorithms</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.12]">
            Jahan jaankari mein andhera hai, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E4E4E7] to-[#71717A]">
              wahan roshni.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-xl mx-auto leading-relaxed">
            Enter any scholarship, admission, or government scheme. Our autonomous multi-agent pipeline audits multiple sources simultaneously to identify missing gaps, conflicting rules, and outdated circulars.
          </p>

          {/* Interactive Search Console HUD */}
          <div className="pt-2 relative">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#121214]/90 border border-[#27272A] shadow-2xl backdrop-blur-xl focus-within:border-white/40 focus-within:shadow-[0_0_40px_rgba(255,255,255,0.06)] transition-all duration-300">
              
              <div className="flex items-center gap-3 px-3 py-1.5">
                <Search className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Ask a question or enter a policy topic (e.g., NSP Post-Matric Scholarship rules)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartAnalysis()}
                  className="w-full bg-transparent text-sm sm:text-base text-[#F4F4F5] placeholder-[#71717A] focus:outline-none"
                />
                <button
                  onClick={() => handleStartAnalysis()}
                  disabled={isAnalyzing}
                  className="h-10 px-5 rounded-xl bg-white hover:bg-[#E4E4E7] text-[#0A0A0B] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2} />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>

              {/* Optional Custom URLs toggle */}
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between text-xs text-[#71717A] border-t border-[#27272A]/70 mt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#A1A1AA]" strokeWidth={1.5} />
                  <span>{showUrlField ? 'Hide custom URL filters' : '+ Ingest specific portal URLs / PDFs'}</span>
                </button>
                <div className="flex items-center gap-2 font-mono-code text-[11px] text-[#A1A1AA]">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>Tavily Live Web Scraper Active</span>
                </div>
              </div>

              {/* Expanded URL Inputs */}
              {showUrlField && (
                <div className="p-3 bg-[#0A0A0B] rounded-xl border border-[#27272A] mt-2 text-left space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste specific official portal URL (e.g. https://scholarships.gov.in)..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                      className="flex-1 bg-[#121214] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-[#F4F4F5] placeholder-[#71717A] focus:outline-none focus:border-white/40"
                    />
                    <button
                      onClick={addUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs text-white cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {customUrls.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {customUrls.map((u, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-[11px] text-[#A1A1AA] flex items-center gap-1.5">
                          <span className="truncate max-w-[200px]">{u}</span>
                          <button onClick={() => removeUrl(i)} className="text-[#71717A] hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-[#71717A]">Try real benchmarks:</span>
              {exampleTopics.map((top, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(top);
                    handleStartAnalysis(top);
                  }}
                  className="px-3 py-1 rounded-full bg-[#141416]/80 hover:bg-[#1E1E22] border border-[#27272A] hover:border-[#3F3F46] text-xs text-[#A1A1AA] hover:text-white transition-all truncate max-w-xs cursor-pointer"
                >
                  {top.split(' ')[0]} {top.split(' ')[1]} {top.split(' ')[2]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live SSE Multi-Agent Progress Streamer */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto bg-[#121214]/90 border border-[#27272A] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] pb-3 border-b border-[#27272A]">
              <span className="flex items-center gap-2.5 font-bold text-white">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" strokeWidth={2} />
                Multi-Agent Coordination & Quote-Gating Active...
              </span>
              <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                {agentProgress.length} steps executed
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto font-mono-code text-xs pr-1">
              {agentProgress.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-[#A1A1AA]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-[#71717A] uppercase text-[10px] w-36 truncate">[{p.step}]</span>
                  <span className="text-[#F4F4F5] truncate">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS WORKSPACE */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Report Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272A]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono-code px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    VERIFIED AUDIT REPORT
                  </span>
                  <span className="text-xs text-[#71717A]">•</span>
                  <span className="text-xs font-mono-code text-[#A1A1AA]">ID: {result.id}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {result.question}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#A1A1AA]">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{result.sources.length} Sources Ingested</span>
              </div>
            </div>

            {/* TOP METRIC STRIP (FUTURISTIC HUD GAUGES) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              
              {/* Coverage Card */}
              <div className="bg-[#121214]/80 border border-[#27272A] rounded-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[#3F3F46] transition-all">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-[#A1A1AA] font-medium">Coverage</div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 font-mono-code">
                  {(result.coverage * 100).toFixed(0)}%
                </div>
                <div className="w-full h-1 bg-[#0A0A0B] rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${result.coverage * 100}%` }} />
                </div>
                <div className="text-[10px] text-[#71717A] mt-1.5 font-mono-code">Verified Attributes</div>
              </div>

              {/* Gaps Card */}
              <div className="bg-[#121214]/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-400 transition-all bg-amber-500/[0.02]">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-amber-400 font-medium">Gaps Found</div>
                  <CircleDashed className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight mt-1 font-mono-code">
                  {result.summary_counts.gaps}
                </div>
                <div className="w-full h-1 bg-[#0A0A0B] rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="text-[10px] text-amber-400/80 mt-1.5 font-mono-code">Missing Guidelines</div>
              </div>

              {/* Conflicts Card */}
              <div className="bg-[#121214]/80 border border-rose-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden group hover:border-rose-400 transition-all bg-rose-500/[0.02]">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-rose-400 font-medium">Conflicts</div>
                  <ArrowLeftRight className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 tracking-tight mt-1 font-mono-code">
                  {result.summary_counts.conflicts}
                </div>
                <div className="w-full h-1 bg-[#0A0A0B] rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: '40%' }} />
                </div>
                <div className="text-[10px] text-rose-400/80 mt-1.5 font-mono-code">Opposing Rules</div>
              </div>

              {/* Outdated Card */}
              <div className="bg-[#121214]/80 border border-amber-400/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-400 transition-all bg-amber-400/[0.02]">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-[#E4E4E7] font-medium">Outdated Notices</div>
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 tracking-tight mt-1 font-mono-code">
                  {result.summary_counts.outdated}
                </div>
                <div className="w-full h-1 bg-[#0A0A0B] rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-amber-300 rounded-full" style={{ width: '25%' }} />
                </div>
                <div className="text-[10px] text-[#A1A1AA] mt-1.5 font-mono-code">Expired Cycles</div>
              </div>

              {/* Dark Spot Index (DSI) */}
              <div className="bg-[#121214]/80 border border-[#27272A] rounded-2xl p-4 sm:p-5 col-span-2 sm:col-span-3 lg:col-span-1 backdrop-blur-xl group hover:border-[#3F3F46] transition-all">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-[#A1A1AA] font-medium">Dark Spot Index (DSI)</div>
                  <TrendingDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 font-mono-code">
                  {(result.dsi * 100).toFixed(0)}%
                </div>
                <div className="w-full h-1 bg-[#0A0A0B] rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full" style={{ width: `${result.dsi * 100}%` }} />
                </div>
                <div className="text-[10px] text-[#71717A] mt-1.5 font-mono-code">DSI = 1 − Coverage</div>
              </div>

            </div>

            {/* Filter Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-[#27272A] pb-3 overflow-x-auto text-xs font-medium">
              {[
                { id: 'all', label: 'All Findings', count: result.findings.length },
                { id: 'gaps', label: 'Potential Gaps', count: result.summary_counts.gaps },
                { id: 'conflicts', label: 'Conflicts', count: result.summary_counts.conflicts },
                { id: 'outdated', label: 'Outdated Notices', count: result.summary_counts.outdated },
                { id: 'facts', label: 'Verified Facts', count: result.summary_counts.sourced_facts },
                { id: 'heatmap', label: 'Coverage Topology Matrix (F12)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#0A0A0B] font-bold shadow-md'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B] border border-transparent'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded-full ${
                      activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
                    }`}>
                      {tab.count}
                    </span>
                  )}
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
                <div className="lg:col-span-7 space-y-3.5">
                  {filteredFindings.length === 0 ? (
                    <div className="p-8 text-center bg-[#121214] border border-[#27272A] rounded-2xl text-xs text-[#A1A1AA]">
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
                        ? 'border-dashed border-amber-500/40 bg-amber-500/[0.02]'
                        : isConflict
                        ? 'border-solid border-rose-500/40 bg-rose-500/[0.02]'
                        : isOutdated
                        ? 'border-dotted border-amber-300/40 bg-amber-300/[0.02]'
                        : 'border-[#27272A] bg-[#121214]/80';

                      const Icon = isGap ? CircleDashed : isConflict ? ArrowLeftRight : isOutdated ? Clock : Check;

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedFinding(finding)}
                          className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer select-none backdrop-blur-xl border ${borderStyle} ${
                            isSelected 
                              ? 'ring-2 ring-white bg-[#18181B] shadow-[0_0_30px_rgba(255,255,255,0.08)]' 
                              : 'hover:bg-[#18181B] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <span className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
                                isConflict
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : isGap
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : isOutdated
                                  ? 'bg-amber-300/10 text-amber-300'
                                  : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                <Icon className="w-4 h-4" strokeWidth={1.5} />
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-[#F4F4F5] capitalize">
                                    {finding.attribute.replace('_', ' ')}
                                  </h4>
                                  <span className="text-[10px] font-mono-code text-[#71717A]">
                                    (Conf: {((finding.confidence || 0.9) * 100).toFixed(0)}%)
                                  </span>
                                </div>
                                <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">
                                  {finding.statement}
                                </p>

                                {/* Verbatim Quote Pill */}
                                {finding.evidence && finding.evidence.length > 0 ? (
                                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-[#E4E4E7] font-mono-code">
                                    <FileText className="w-3 h-3 text-emerald-400" />
                                    <span>{finding.evidence.length} Verbatim Quote(s) Verified</span>
                                  </div>
                                ) : (
                                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-mono-code">
                                    <span>Abstain Mode: Not found in reviewed sources</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Badge */}
                            <span
                              className={`text-[10px] font-mono-code px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0 ${
                                isConflict
                                  ? 'bg-rose-500 text-white font-bold'
                                  : isGap
                                  ? 'border border-dashed border-amber-400 text-amber-400 font-semibold'
                                  : isOutdated
                                  ? 'bg-amber-400 text-black font-semibold'
                                  : 'bg-[#18181B] border border-[#27272A] text-[#A1A1AA]'
                              }`}
                            >
                              {finding.type === 'conflict' ? 'Conflict' : finding.type === 'outdated' ? 'Outdated' : isGap ? 'Potential gap' : 'Sourced Fact'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Column: Sticky Evidence Sheet Panel (5 Cols - Image 4) */}
                <div className="lg:col-span-5 sticky top-20">
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
