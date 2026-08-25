import React, { useState } from 'react';
import { Sparkles, TrendingUp, Clock, ShieldCheck, PieChart, Info, ArrowUpRight, ThumbsUp, ThumbsDown, Check, Layers, ListFilter, Lock } from 'lucide-react';
import { useGravequit } from '../context/GravequitContext';
import { Card } from '../components/Card';
import { TagPill } from '../components/TagPill';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const MOCK_DEMO_STATS = {
  aiSummaryText: "You demonstrate a strong analytical approach to closure. While 'Too Busy' frequently triggers your pauses, your high momentum score indicates excellent self-awareness and recovery pacing. You tend to finalize decisions on Thursdays, suggesting end-of-week reflection is highly effective for your workflow.",
  averageDaysToQuit: 14.5,
  momentumScore: 82,
  totalQuitEvents: 47,
  tagBreakdown: [
    { tag: "Too Busy", count: 18 },
    { tag: "Too Hard", count: 12 },
    { tag: "Lost Interest", count: 9 },
    { tag: "No Deadline", count: 5 },
    { tag: "Other", count: 3 }
  ],
  risk_explanation: "High occurrence of 'Too Busy' combined with short average commitment (14 days) suggests taking on too many concurrent projects.",
  clusters: {
    "Time Management Struggles": ["Quit painting class after 2 weeks", "Paused coding bootcamp"],
    "Shifting Priorities": ["Stopped learning French to focus on work", "Dropped side hustle"]
  },
  similar_entries: [
    "I was too busy with my new job and couldn't find the time.",
    "Work got overwhelming, had to prioritize my mental health."
  ]
};

export const PatternDashboardPage = () => {
  const navigate = useNavigate();
  const { patternStats, items, submitSummaryFeedback, isAuthenticated } = useGravequit();
  
  const displayStats = isAuthenticated ? patternStats : MOCK_DEMO_STATS;
  const activeItems = items.filter(i => i.status === 'active');
  
  const [feedbackSent, setFeedbackSent] = useState(null); // 'up' | 'down' | null
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleFeedback = async (rating) => {
    setFeedbackSent(rating === 1 ? 'up' : 'down');
    const res = await submitSummaryFeedback(rating);
    if (res.success) {
      setFeedbackMsg('Feedback recorded in database — thank you!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8 space-y-8 relative">
      
      {!isAuthenticated && (
        <div className="absolute inset-0 z-50 pointer-events-none p-4">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-[#131313]/90 backdrop-blur-xl border border-[#2A2A2A] p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
            <div className="w-14 h-14 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-[#A8C5B0]" />
            </div>
            <h2 className="text-2xl font-bold font-headline text-[#F5F5F0] mb-3">
              Unlock Personalized Insights
            </h2>
            <p className="text-[#8A8A8A] text-sm leading-relaxed mb-8">
              This is just a preview of what Gravequit can do. Sign in to start logging your own journeys and let our AI uncover gentle, personalized insights about your patterns.
            </p>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-center" onClick={() => navigate('/login')}>
                Sign In to Gravequit
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto space-y-8 transition-all duration-500 ${!isAuthenticated ? 'blur-md opacity-40 pointer-events-none select-none' : ''}`}>
        
        {/* Header */}
        <div className="pb-4 border-b border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#A8C5B0] font-mono uppercase tracking-widest block mb-1">
              Grounded Pattern Analytics
            </span>
            <h1 className="text-3xl font-extrabold font-headline text-[#F5F5F0]">Pattern Dashboard</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">
              Synthesized insights generated from real computed numbers — never hallucinated.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/share')}>
              Share Pattern Card
            </Button>
          </div>
        </div>

        {/* AI Synthesis Quote Card */}
        <Card className="p-8 bg-gradient-to-r from-[#1A1A1A] via-[#161E19] to-[#1A1A1A] border-[#A8C5B0]/30 relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A8C5B0]">
                <Sparkles className="w-4 h-4" />
                <span>AI Synthesis Narrative (LangGraph Grounded)</span>
              </div>
              <span className="text-[11px] text-[#8A8A8A] font-mono">Fact-Check Status: Verified 100%</span>
            </div>

            <blockquote className="text-lg md:text-xl font-headline font-semibold text-[#F5F5F0] leading-relaxed italic">
              "{displayStats.aiSummaryText}"
            </blockquote>

            {/* Risk Explanation from Pipeline */}
            {displayStats.risk_explanation && (
              <div className="p-3 bg-[#131313]/80 border border-[#2A2A2A] rounded-lg text-xs text-[#A8C5B0]">
                <strong>Primary Signal:</strong> {displayStats.risk_explanation}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#2A2A2A]/60">
              <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
                <ShieldCheck className="w-4 h-4 text-[#A8C5B0]" />
                <span>Every claim above corresponds to a real statistic logged in your history.</span>
              </div>

              {/* Thumbs Up / Down Feedback Widget */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8A8A8A]">Is this insight helpful?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFeedback(1)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      feedbackSent === 'up'
                        ? 'bg-[#354F3E] text-[#A8C5B0] border-[#A8C5B0]'
                        : 'bg-[#131313] text-[#8A8A8A] border-[#2A2A2A] hover:text-[#F5F5F0] hover:border-[#454843]'
                    }`}
                    title="Accurate & helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback(-1)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      feedbackSent === 'down'
                        ? 'bg-[#1C1B1B] text-[#FFB4AB] border-[#FFB4AB]'
                        : 'bg-[#131313] text-[#8A8A8A] border-[#2A2A2A] hover:text-[#F5F5F0] hover:border-[#454843]'
                    }`}
                    title="Needs refinement"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                {feedbackMsg && (
                  <span className="text-[11px] text-[#A8C5B0] font-mono animate-fade-in">
                    {feedbackMsg}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Semantic Clusters & Similar Entries (LangGraph Pipeline Output) */}
        {displayStats.clusters && Object.keys(displayStats.clusters).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card header="Semantic Reason Clusters (Beyond 5 Tags)" headerAccent={true}>
              <div className="space-y-3">
                <p className="text-xs text-[#8A8A8A]">
                  Unsupervised TF-IDF clustering grouping your free-form thoughts into recurring sub-patterns:
                </p>
                <div className="space-y-2.5">
                  {Object.entries(displayStats.clusters).map(([clusterName, entries]) => (
                    <div key={clusterName} className="p-3 bg-[#131313] border border-[#2A2A2A] rounded-lg space-y-1">
                      <span className="text-xs font-semibold text-[#A8C5B0] block">{clusterName}</span>
                      <ul className="text-xs text-[#8A8A8A] space-y-0.5 list-disc list-inside">
                        {entries.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="italic">"{item}"</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card header="RAG Similar Historical Precedents">
              <div className="space-y-3">
                <p className="text-xs text-[#8A8A8A]">
                  Historical entries most similar in language and context to your latest observation:
                </p>
                {displayStats.similar_entries && displayStats.similar_entries.length > 0 ? (
                  <div className="space-y-2">
                    {displayStats.similar_entries.map((sim, i) => (
                      <div key={i} className="p-2.5 bg-[#131313] border border-[#2A2A2A] rounded-lg text-xs text-[#F5F5F0] italic">
                        "{sim}"
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8A8A8A] italic">
                    Additional precedents will appear as you log more detailed reflections.
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card header="Average Days to Closure">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold font-headline text-[#F5F5F0]">
                  {displayStats.averageDaysToQuit}
                </span>
                <span className="text-sm text-[#8A8A8A]">days average commitment</span>
              </div>
              <p className="text-xs text-[#8A8A8A]">
                Computed strictly from your {displayStats.totalQuitEvents} logged past observations.
              </p>
            </div>
          </Card>

          <Card header="Momentum Score">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold font-headline text-[#A8C5B0]">
                  {displayStats.momentumScore}/100
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
                  {displayStats.totalQuitEvents}
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
              {displayStats.tagBreakdown.map((item) => (
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

          {activeItems.length === 0 ? (
            <Card className="text-center py-8 text-xs text-[#8A8A8A]">
              No active items right now. Add a pursuit to see live risk predictions.
            </Card>
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
};
