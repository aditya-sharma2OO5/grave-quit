import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle, ShieldCheck, RotateCcw, Layers, Mic } from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TagPill } from '../components/TagPill';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, openQuitModal, recommitItem } = useGraveyard();

  const item = items.find(i => i.id === id) || items[0];
  const isActive = item?.status === 'active';

  // Find past items for comparison mode
  const pastComparisonItems = items.filter(i => i.status === 'quit').slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/items')}
          className="inline-flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#F5F5F0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Items</span>
        </button>

        {/* Item Banner Header */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[16px] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                isActive 
                  ? 'bg-[#354F3E] text-[#B0CEB8] border-[#A8C5B0]' 
                  : 'bg-[#131313] text-[#8A8A8A] border-[#2A2A2A]'
              }`}>
                {isActive ? 'Active Pursuit' : 'Past Observation'}
              </span>
              <span className="text-xs text-[#8A8A8A] font-mono">
                Category: {item.category}
              </span>
            </div>

            {isActive ? (
              <Button variant="secondary" size="sm" onClick={() => openQuitModal(item)}>
                Mark as Quit
              </Button>
            ) : (
              <Button variant="accent" size="sm" onClick={() => recommitItem(item.id)}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Re-Commit (Easier Version)</span>
              </Button>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-[#F5F5F0]">
            {item.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-[#8A8A8A]">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#A8C5B0]" />
              <span>Started: {item.started_at}</span>
            </div>
            {item.ended_at && (
              <div>
                <span>Ended: {item.ended_at} ({item.durationDays} days active)</span>
              </div>
            )}
          </div>
        </div>

        {/* DUAL STATE VIEW */}

        {isActive ? (
          /* ACTIVE STATE CONTENT */
          <div className="space-y-6">
            
            {/* Quit-Risk Assessment Card */}
            <Card header="Predictive Quit-Risk Assessment" headerAccent={true}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl">
                  <div>
                    <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block">
                      Live Quit Risk Probability
                    </span>
                    <span className="text-3xl font-extrabold font-headline text-[#F5F5F0]">
                      {item.riskScore}%
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#454843] text-[#C5C7C1]">
                    {item.riskBadge || 'Moderate Risk'}
                  </span>
                </div>

                <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-[#A8C5B0] block">
                    "Why this prediction" Explainer:
                  </span>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">
                    {item.riskReason || 'Based on historical drop-off trends in similar course categories.'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Comparison Mode Card */}
            <Card header="Comparison Mode: Grounded in Your Past Precedents">
              <div className="space-y-3">
                <p className="text-xs text-[#8A8A8A]">
                  This risk score is compared against 2 of your own past similar observations:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastComparisonItems.map((past) => (
                    <div key={past.id} className="p-3.5 bg-[#131313] border border-[#2A2A2A] rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#F5F5F0]">{past.title}</span>
                        <span className="text-[#8A8A8A] font-mono">{past.durationDays} days</span>
                      </div>
                      <TagPill tag={past.reason_tag} selected={true} size="sm" />
                      <p className="text-[11px] text-[#8A8A8A] italic">"{past.reason_text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>
        ) : (
          /* QUIT / CONCLUDED STATE CONTENT */
          <div className="space-y-6">
            
            {/* Closure Details Card */}
            <Card header="Closure Reflection & Captured Reason" headerAccent={true}>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                    Primary Reason Tag (1 of 5 Preset Tags)
                  </span>
                  <TagPill tag={item.reason_tag} selected={true} size="lg" />
                </div>

                <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-[#F5F5F0] block">
                    Captured Note:
                  </span>
                  <p className="text-sm text-[#8A8A8A] italic">
                    "{item.reason_text}"
                  </p>
                </div>

                {item.voice_transcript && (
                  <div className="p-4 bg-[#131313] border border-[#A8C5B0]/30 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#A8C5B0]">
                      <Mic className="w-4 h-4" />
                      <span className="font-semibold">Voice Transcript Logged:</span>
                    </div>
                    <p className="text-xs text-[#B0CEB8] italic">
                      "{item.voice_transcript}"
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Re-Commit Card */}
            <Card header="Re-Commit Flow: Not Ready to Fully Let This Go?">
              <div className="p-4 bg-[#20201F] border border-[#2A2A2A] rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-[#F5F5F0]">
                  Restart an Easier, Modular Version
                </h4>
                <p className="text-xs text-[#8A8A8A] leading-relaxed">
                  Instead of abandoning this pursuit permanently, you can re-commit with 15-minute daily micro-milestones.
                </p>
                <Button variant="accent" size="sm" onClick={() => recommitItem(item.id)}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Start Modular 15-min Version Now</span>
                </Button>
              </div>
            </Card>

          </div>
        )}

      </div>
    </div>
  );
};
