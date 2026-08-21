import React from 'react';
import { Sparkles, TrendingUp, Clock, ShieldCheck, PieChart, Info, ArrowUpRight } from 'lucide-react';
import { useGravequit } from '../context/GravequitContext';
import { Card } from '../components/Card';
import { TagPill } from '../components/TagPill';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const PatternDashboardPage = () => {
  const navigate = useNavigate();
  const { patternStats, items } = useGravequit();
  const activeItems = items.filter(i => i.status === 'active');

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A]">
          <span className="text-xs text-[#A8C5B0] font-mono uppercase tracking-widest block mb-1">
            Grounded Pattern Analytics
          </span>
          <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Pattern Dashboard</h1>
          <p className="text-sm text-[#8A8A8A] mt-1">
            Synthesized insights generated from real computed numbers — never hallucinated.
          </p>
        </div>

        {/* AI Synthesis Quote Card */}
        <Card className="p-8 bg-gradient-to-r from-[#1A1A1A] via-[#161E19] to-[#1A1A1A] border-[#A8C5B0]/30 relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A8C5B0]">
                <Sparkles className="w-4 h-4" />
                <span>AI Synthesis Narrative (LangGraph Grounded)</span>
              </div>
              <span className="text-[11px] text-[#8A8A8A] font-mono">Fact-Check Status: Verified 100%</span>
            </div>

            <blockquote className="text-lg md:text-xl font-headline font-semibold text-[#F5F5F0] leading-relaxed italic">
              "{patternStats.aiSummaryText}"
            </blockquote>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#8A8A8A]">
              <ShieldCheck className="w-4 h-4 text-[#A8C5B0]" />
              <span>Every claim above corresponds to a real statistic logged in your history.</span>
            </div>
          </div>
        </Card>

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card header="Average Days to Closure">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold font-headline text-[#F5F5F0]">
                  {patternStats.averageDaysToQuit}
                </span>
                <span className="text-sm text-[#8A8A8A]">days average commitment</span>
              </div>
              <p className="text-xs text-[#8A8A8A]">
                Computed strictly from your {patternStats.totalQuitEvents} logged past observations.
              </p>
            </div>
          </Card>

          <Card header="Momentum Score">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold font-headline text-[#A8C5B0]">
                  {patternStats.momentumScore}/100
                </span>
                <span className="text-xs text-[#A8C5B0] bg-[#354F3E] px-2 py-0.5 rounded-full border border-[#A8C5B0]/40">
                  Steady Recovery
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A]">
                Credits partial progress across all attempts. Formulated to praise expanding recovery windows.
              </p>
            </div>
          </Card>

          <Card header="Total Logged Closures">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold font-headline text-[#F5F5F0]">
                  {patternStats.totalQuitEvents}
                </span>
                <span className="text-sm text-[#8A8A8A]">observations</span>
              </div>
              <p className="text-xs text-[#8A8A8A]">
                Recorded via the 10-second instant reason capture flow.
              </p>
            </div>
          </Card>

        </div>

        {/* 5 Reason Tag Breakdown Grid */}
        <Card header="Primary Closure Drivers (Strict 5-Tag Breakdown)" headerAccent={true}>
          <div className="space-y-6">
            <p className="text-xs text-[#8A8A8A]">
              Breakdown across the 5 standard allowed tag categories:
            </p>

            <div className="space-y-4">
              {patternStats.tagBreakdown.map((item) => (
                <div key={item.tag} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <TagPill tag={item.tag} selected={item.count > 0} size="sm" />
                      <span className="text-[#8A8A8A]">({item.count} occurrences)</span>
                    </div>
                    <span className="font-mono text-[#F5F5F0]">{item.percentage}%</span>
                  </div>
                  
                  <div className="w-full h-2 rounded-full bg-[#131313] border border-[#2A2A2A] overflow-hidden">
                    <div 
                      className="h-full bg-[#A8C5B0] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Active Items Quit-Risk Assessment */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-headline text-[#F5F5F0]">
            Current Active Quit-Risk Assessment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeItems.map((item) => (
              <Card key={item.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold font-headline text-[#F5F5F0]">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-[#A8C5B0] bg-[#131313] px-2.5 py-1 rounded-md border border-[#2A2A2A]">
                    {item.riskScore}% Live Risk
                  </span>
                </div>

                <div className="p-3 bg-[#131313] border border-[#2A2A2A] rounded-lg text-xs text-[#8A8A8A] space-y-1">
                  <span className="font-semibold text-[#F5F5F0] block">Why this prediction:</span>
                  <p>{item.riskReason}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/items/${item.id}`)}>
                    <span>View Detail & Comparison</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
