'use client';

import React, { useState } from 'react';
import { Clock, Plus, ExternalLink, ShieldAlert, CheckCircle, Bell, ArrowRight } from 'lucide-react';

export default function WatchtowerPage() {
  const [newUrl, setNewUrl] = useState('');

  const trackedSources = [
    {
      url: 'https://scholarships.gov.in/guidelines/post-matric.pdf',
      domain: 'scholarships.gov.in',
      topic: 'National Scholarship Portal 2026',
      lastChecked: '10 mins ago',
      status: 'Active · Unchanged',
      simhash: '0x8f43a91c2b',
      changeDetected: false,
    },
    {
      url: 'https://pmaymis.gov.in/circulars/income-criteria-2026.pdf',
      domain: 'pmaymis.gov.in',
      topic: 'PM Awas Yojana Income Criteria',
      lastChecked: '1 hour ago',
      status: 'Meaningful Change Detected',
      simhash: '0x3c71df99a1',
      changeDetected: true,
      alertNote: 'Income ceiling clause modified from ₹1.5L to ₹2.0L (Hamming distance d_H = 8 > 3)',
    },
    {
      url: 'https://jeeadv.ac.in/seat-acceptance-circular',
      domain: 'jeeadv.ac.in',
      topic: 'JoSAA Seat Acceptance Fee Schedule',
      lastChecked: '4 hours ago',
      status: 'Minor Edit (Formatting)',
      simhash: '0x9924a1b02d',
      changeDetected: false,
      alertNote: 'Typo correction in helpdesk contact email (d_H = 1 <= 3)',
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#2C2C30] gap-4">
        <div>
          <span className="text-[11px] font-mono-code font-semibold text-[#6B6B76] uppercase tracking-wider">
            WATCHTOWER · CHANGE RADAR (F13)
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Continuous Source & Circular Monitoring
          </h1>
          <p className="text-xs text-[#9A9AA2] mt-1 max-w-xl">
            SimHash Hamming distance (&le; 3) and CUSUM sequential spike detection monitoring official policy pages 24/7 for unannounced rule changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Add official URL to monitor..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="h-9 px-3 text-xs bg-[#18181A] border border-[#2C2C30] rounded-lg text-white placeholder-[#6B6B76] focus:outline-none w-64"
          />
          <button
            onClick={() => setNewUrl('')}
            className="h-9 px-3 rounded-lg bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Track</span>
          </button>
        </div>
      </div>

      {/* Monitored Feeds */}
      <div className="space-y-4">
        {trackedSources.map((source, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border transition-all ${
              source.changeDetected
                ? 'bg-[#18181A] border-white/40 ring-1 ring-white/20'
                : 'bg-[#18181A] border-[#2C2C30]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${source.changeDetected ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <h3 className="text-sm font-semibold text-white">{source.topic}</h3>
                <span className="text-[11px] font-mono-code text-[#6B6B76]">({source.domain})</span>
              </div>
              <span className="text-xs text-[#9A9AA2] font-mono-code">Last audit: {source.lastChecked}</span>
            </div>

            <p className="text-xs font-mono-code text-[#9A9AA2] truncate mb-2">
              {source.url}
            </p>

            {source.alertNote && (
              <div className="mt-3 p-3 rounded-lg bg-[#0F0F10] border border-[#2C2C30] text-xs text-[#E4E4E7] flex items-start gap-2">
                <Bell className="w-4 h-4 text-white flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{source.alertNote}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
