import React from 'react';
import { Feather, ShieldCheck, Share2 } from 'lucide-react';
import { TagPill } from './TagPill';

export const ShareCardPreview = ({ 
  title = "Pattern Discovery",
  quote = "My top closure driver is 'No Deadline'. When commitments lack a clear milestone, momentum naturally tapers after Day 21.",
  tag = "No Deadline",
  stats = "30 Days Avg Duration · 74 Momentum Score",
  date = "August 2026"
}) => {
  return (
    <div className="w-full max-w-xl mx-auto rounded-[20px] p-8 bg-gradient-to-br from-[#1A1A1A] via-[#131313] to-[#0E0E0E] border border-[#2A2A2A] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
      
      {/* Background Decorative Ambient Fog */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8C5B0]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#A8C5B0]/5 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>
      
      {/* Semi-transparent dark overlay for guaranteed text legibility */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Card Content Container */}
      <div className="relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A]/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#A8C5B0]/40 flex items-center justify-center">
              <Feather className="w-4 h-4 text-[#A8C5B0]" />
            </div>
            <div>
              <span className="text-sm font-bold font-headline tracking-tight text-[#F5F5F0]">
                Graveyard AI
              </span>
              <span className="block text-[9px] text-[#8A8A8A] uppercase tracking-widest font-semibold">
                Quiet Closure Insight
              </span>
            </div>
          </div>
          <span className="text-xs text-[#8A8A8A] font-mono">{date}</span>
        </div>

        {/* Core Tag */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-2 font-semibold">
            Primary Closure Driver
          </span>
          <TagPill tag={tag} selected={true} size="lg" />
        </div>

        {/* Insight Quote */}
        <div className="my-2">
          <blockquote className="text-lg md:text-xl font-headline font-semibold text-[#F5F5F0] leading-relaxed italic border-l-2 border-[#A8C5B0] pl-4 py-1">
            "{quote}"
          </blockquote>
        </div>

        {/* Stats Pill Footer */}
        <div className="pt-4 border-t border-[#2A2A2A]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8A8A8A]">
          <div className="font-mono bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#A8C5B0]">
            {stats}
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] text-[#8A8A8A]">
            <ShieldCheck className="w-4 h-4 text-[#A8C5B0]" />
            <span>Only chosen insight leaves the app. Raw data stays private.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
