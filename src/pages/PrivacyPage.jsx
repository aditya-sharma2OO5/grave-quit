import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, FileText, Mail } from 'lucide-react';
import { Card } from '../components/Card';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-12 space-y-10">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#A8C5B0]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-[#F5F5F0]">
            Privacy & Data Commitments
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            Transparency in how your reflections are stored, fact-checked, and protected.
          </p>
        </div>

        {/* Section 1: What We Collect vs What We Never Do */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card header="What We Collect">
            <ul className="space-y-2.5 text-xs text-[#8A8A8A]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8C5B0] shrink-0 mt-1.5"></span>
                <span>Account email for authentication and password recovery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8C5B0] shrink-0 mt-1.5"></span>
                <span>Logged item titles, start dates, end dates, and categories.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8C5B0] shrink-0 mt-1.5"></span>
                <span>The 5 standard reason tags and optional one-line reflections.</span>
              </li>
            </ul>
          </Card>

          <Card header="What We NEVER Do" headerAccent={true}>
            <ul className="space-y-2.5 text-xs text-[#8A8A8A]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93000A] shrink-0 mt-1.5"></span>
                <span>We NEVER sell, rent, or monetize your personal journal entries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93000A] shrink-0 mt-1.5"></span>
                <span>We NEVER share identifiable data with university administrators or faculty.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93000A] shrink-0 mt-1.5"></span>
                <span>We NEVER train public AI models on your raw private text notes.</span>
              </li>
            </ul>
          </Card>

        </div>

        {/* Section 2: Voice & Text Handling */}
        <Card header="Voice & Text Processing Security">
          <div className="space-y-3 text-xs text-[#8A8A8A] leading-relaxed">
            <p>
              When you record an optional voice note during the 10-second quit flow, audio is processed ephemerally solely to generate text transcripts and suggest one of the 5 standard tags. Raw audio files are discarded immediately following transcription.
            </p>
            <p>
              AI pattern synthesis uses RAG (Retrieval-Augmented Generation) orchestrated via a multi-agent LangGraph pipeline. Every AI claim is validated against real mathematical numbers in code before presentation.
            </p>
          </div>
        </Card>

        {/* Section 3: Institutional Data */}
        <Card header="Institutional Advisor Dashboard Guarantee">
          <div className="space-y-3 text-xs text-[#8A8A8A] leading-relaxed">
            <p>
              The optional Advisor Dashboard provided to university wellness offices presents only aggregated, campus-wide metrics (e.g. "42% of student closures cite Exam Season schedule pressure").
            </p>
            <p className="font-semibold text-[#F5F5F0]">
              Individual student names, active course lists, and personal journal notes are strictly excluded from institutional views.
            </p>
          </div>
        </Card>

        {/* Section 4: Contact & Controls */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-center space-y-2">
          <h3 className="text-base font-bold font-headline text-[#F5F5F0]">Questions About Privacy?</h3>
          <p className="text-xs text-[#8A8A8A]">
            Contact our privacy compliance team directly at privacy@gravequit.ai
          </p>
        </div>

      </div>
    </div>
  );
};
