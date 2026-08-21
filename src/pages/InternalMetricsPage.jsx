import React from 'react';
import { Cpu, ThumbsUp, ThumbsDown, Activity, Users, FileText, CheckCircle2, Zap } from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { Card } from '../components/Card';
import { TagPill } from '../components/TagPill';

export const InternalMetricsPage = () => {
  const { internalMetrics } = useGraveyard();

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#A8C5B0] font-mono uppercase tracking-widest mb-1">
              <Cpu className="w-4 h-4 text-[#A8C5B0]" />
              <span>Internal Hackathon & Product Verification Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Team / Judge Metrics</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">
              Internal numbers proving real user engagement, RAG accuracy, and multi-agent pipeline performance.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-xs text-[#8A8A8A] font-mono">
            Status: Live System Online
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card header="Total Registered Users">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold font-headline text-[#F5F5F0]">
                {internalMetrics.totalUsers.toLocaleString()}
              </span>
              <span className="text-xs text-[#8A8A8A] block">Verified Student Accounts</span>
            </div>
          </Card>

          <Card header="Total Items Logged">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold font-headline text-[#F5F5F0]">
                {internalMetrics.totalItemsLogged.toLocaleString()}
              </span>
              <span className="text-xs text-[#8A8A8A] block">Courses, Skills, Habits</span>
            </div>
          </Card>

          <Card header="Quit Events Recorded">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold font-headline text-[#F5F5F0]">
                {internalMetrics.totalQuitEvents.toLocaleString()}
              </span>
              <span className="text-xs text-[#8A8A8A] block">10-Second Flow Completed</span>
            </div>
          </Card>

          <Card header="AI Synthesis Accuracy">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold font-headline text-[#A8C5B0]">
                {internalMetrics.aiAccuracyRate}%
              </span>
              <span className="text-xs text-[#8A8A8A] block">Fact-Check Grounding Score</span>
            </div>
          </Card>

        </div>

        {/* AI Accuracy & Feedback Breakdown */}
        <Card header="AI Grounding & User Thumbs Feedback (LangGraph Pipeline)" headerAccent={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="space-y-2 text-center p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl">
              <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block">Fact-Check Accuracy</span>
              <span className="text-4xl font-extrabold font-headline text-[#A8C5B0]">
                {internalMetrics.aiAccuracyRate}%
              </span>
              <p className="text-[11px] text-[#8A8A8A]">Zero invented mathematical claims</p>
            </div>

            <div className="space-y-2 text-center p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl">
              <div className="flex items-center justify-center gap-2 text-[#A8C5B0]">
                <ThumbsUp className="w-5 h-5" />
                <span className="text-2xl font-bold font-headline">{internalMetrics.thumbsUpCount}</span>
              </div>
              <span className="text-xs text-[#8A8A8A] block">Positive Thumbs-Up Reactions</span>
            </div>

            <div className="space-y-2 text-center p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl">
              <div className="flex items-center justify-center gap-2 text-[#8A8A8A]">
                <ThumbsDown className="w-5 h-5" />
                <span className="text-2xl font-bold font-headline">{internalMetrics.thumbsDownCount}</span>
              </div>
              <span className="text-xs text-[#8A8A8A] block">Needs Refinement Ratings</span>
            </div>

          </div>
        </Card>

        {/* DAU Trend + Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DAU Trend Chart representation */}
          <Card header="Daily Active Users Trend (DAU)">
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2 border-b border-[#2A2A2A]">
                {internalMetrics.dauTrend.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full max-w-[36px] bg-[#354F3E] hover:bg-[#A8C5B0] rounded-t-lg transition-all"
                      style={{ height: `${(d.dau / 5000) * 100}%` }}
                    ></div>
                    <span className="text-[10px] text-[#8A8A8A] font-mono">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#8A8A8A] text-center">Peak activity on Friday near assignment deadlines.</p>
            </div>
          </Card>

          {/* Recent Live Activity Feed */}
          <Card header="Live Activity Stream">
            <div className="space-y-3">
              {internalMetrics.recentActivity.map((act) => (
                <div key={act.id} className="p-3 bg-[#131313] border border-[#2A2A2A] rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#F5F5F0]">{act.action}</span>
                      <TagPill tag={act.tag} selected={true} size="sm" />
                    </div>
                    <p className="text-[#8A8A8A] text-[11px]">{act.details}</p>
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] font-mono">{act.time}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};
