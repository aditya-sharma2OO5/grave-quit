import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Feather, Heart, ShieldX, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 md:px-8 py-12 space-y-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] mx-auto flex items-center justify-center">
            <Feather className="w-6 h-6 text-[#A8C5B0]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-headline text-[#F5F5F0]">
            Why We Built Gravequit
          </h1>
          <p className="text-base text-[#8A8A8A] max-w-xl mx-auto">
            A digital sanctuary dedicated to quiet closure, intentional reflection, and ending pursuits without shame.
          </p>
        </div>

        {/* Pull Quote */}
        <div className="p-8 bg-[#1A1A1A] border-l-4 border-[#A8C5B0] rounded-r-2xl shadow-xl">
          <blockquote className="text-xl md:text-2xl font-headline font-bold text-[#F5F5F0] italic leading-relaxed">
            "Self-reflection shouldn't carry a penalty. Most apps treat stopping as a failure — we treat it as valuable data."
          </blockquote>
        </div>

        {/* Narrative Grid */}
        <div className="space-y-6 text-sm text-[#8A8A8A] leading-relaxed">
          <h2 className="text-2xl font-bold font-headline text-[#F5F5F0]">The Student Reflection Problem</h2>
          <p>
            As students, we start dozens of commitments each semester — ambitious online courses, new morning routines, side projects, and complex skills. Yet, when academic workloads peak during midterms or exam season, we inevitably drop some of them.
          </p>
          <p>
            Traditional habit trackers respond with broken streak warnings, flashing red banners, and guilt notifications. This causes students to abandon the tracking app entirely. The underlying reason why they quit is forgotten, and the cycle repeats.
          </p>
        </div>

        {/* What This Isn't Section */}
        <Card header="What Gravequit Is NOT" headerAccent={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl space-y-2">
              <ShieldX className="w-5 h-5 text-[#8A8A8A]" />
              <h4 className="text-sm font-semibold text-[#F5F5F0]">Not Addiction Recovery</h4>
              <p className="text-xs text-[#8A8A8A]">
                No sobriety language, no "clean days" counters, no clinical framing.
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl space-y-2">
              <ShieldX className="w-5 h-5 text-[#8A8A8A]" />
              <h4 className="text-sm font-semibold text-[#F5F5F0]">No Gamification</h4>
              <p className="text-xs text-[#8A8A8A]">
                No badges, no streak counters, no punishing broken daily chains.
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#2A2A2A] rounded-xl space-y-2">
              <ShieldX className="w-5 h-5 text-[#8A8A8A]" />
              <h4 className="text-sm font-semibold text-[#F5F5F0]">Not Student Surveillance</h4>
              <p className="text-xs text-[#8A8A8A]">
                University offices never receive individual names or raw journal text.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center pt-6 space-y-4">
          <h3 className="text-xl font-bold font-headline text-[#F5F5F0]">Ready to Observe Your Pursuits?</h3>
          <Button size="lg" variant="primary" onClick={() => navigate('/items')}>
            <span>Start Your Journal</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
};
