import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Building2, BarChart2, AlertCircle, HeartHandshake } from 'lucide-react';
import { Card } from '../components/Card';
import { TagPill } from '../components/TagPill';

const API_BASE = 'http://localhost:8000';

export const AdvisorDashboardPage = () => {
  const [advisorMetrics, setAdvisorMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/metrics/advisor`)
      .then(r => r.json())
      .then(data => { setAdvisorMetrics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#8A8A8A]">Loading advisor data...</div>;
  if (!advisorMetrics) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#8A8A8A]">Could not load advisor data. Is the backend running?</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#A8C5B0] font-mono uppercase tracking-widest mb-1">
              <Building2 className="w-4 h-4 text-[#A8C5B0]" />
              <span>Campus Wellness & Advising Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Advisor Dashboard</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">
              Aggregate, anonymized insights to inform proactive wellness support across departments.
            </p>
          </div>

          {/* Ethical framing badge */}
          <div className="p-3 bg-[#1A1A1A] border border-[#A8C5B0]/40 rounded-xl flex items-center gap-2 text-xs text-[#A8C5B0]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Opt-in & 100% Anonymized Only</span>
          </div>
        </div>

        {/* Ethical Promise Banner */}
        <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-[#A8C5B0] shrink-0 mt-0.5" />
          <div className="text-xs text-[#8A8A8A] space-y-1">
            <span className="font-semibold text-[#F5F5F0] block">Ethical Operating Framework:</span>
            <p>
              This dashboard is designed explicitly to "highlight patterns, not individuals... inform proactive support, not disciplinary action." No individual student identity, transcript, or personal note is ever accessible to institutional staff.
            </p>
          </div>
        </div>

        {/* Aggregate Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card header="Active Opted-In Students">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-headline text-[#F5F5F0]">
                {advisorMetrics.activeStudents}
              </span>
              <span className="text-xs text-[#A8C5B0] bg-[#354F3E] px-2 py-0.5 rounded-full border border-[#A8C5B0]/30">
                {advisorMetrics.optInRate} Opt-In
              </span>
            </div>
          </Card>

          <Card header="Total Closures Logged">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-headline text-[#F5F5F0]">
                {advisorMetrics.totalClosuresRecorded}
              </span>
              <span className="text-xs text-[#8A8A8A]">This Semester</span>
            </div>
          </Card>

          <Card header="Avg Student Momentum">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-headline text-[#A8C5B0]">
                {advisorMetrics.avgStudentMomentum}/100
              </span>
              <span className="text-xs text-[#8A8A8A]">Positive Trend</span>
            </div>
          </Card>

          <Card header="Top Institutional Factor">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-headline text-[#F5F5F0]">
                Too Busy (42%)
              </span>
              <span className="text-xs text-[#8A8A8A]">Exam Cycles</span>
            </div>
          </Card>
        </div>

        {/* Closure Drivers Breakdown (Strict 5 Allowed Tags) */}
        <Card header="Cohort Closure Drivers (5-Tag Breakdown)" headerAccent={true}>
          <div className="space-y-6">
            <p className="text-xs text-[#8A8A8A]">
              Aggregated distribution of why students close commitments campus-wide:
            </p>

            <div className="space-y-4">
              {advisorMetrics.closureDrivers.map((item) => (
                <div key={item.tag} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <TagPill tag={item.tag} selected={true} size="sm" />
                      <span className="text-[#8A8A8A]">({item.count} student observations)</span>
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

        {/* Monthly Disengagement Trend Bar Representation */}
        <Card header="Campus Disengagement & Exam Season Clustering">
          <div className="space-y-4">
            <p className="text-xs text-[#8A8A8A]">
              Monthly active vs. closure events showing noticeable spikes around Midterm & Exam seasons:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
              {advisorMetrics.monthlyTrend.map((m) => (
                <div key={m.month} className="p-3 bg-[#131313] border border-[#2A2A2A] rounded-xl text-center space-y-2">
                  <span className="text-xs font-bold text-[#F5F5F0] block">{m.month}</span>
                  <div className="text-xs space-y-0.5">
                    <span className="text-[#A8C5B0] block font-mono">{m.activeCount} Active</span>
                    <span className="text-[#8A8A8A] block font-mono">{m.quitCount} Paused</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
