import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Shield, Sparkles, ArrowRight, CheckCircle2, BarChart2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TagPill } from '../components/TagPill';
import { VALID_REASON_TAGS } from '../data/mockData';
import { useGravequit } from '../context/GravequitContext';
import MemorialShrine from '../components/MemorialShrine';
import GhostSpiritSVG from '../components/GhostSpiritSVG';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, items } = useGravequit();

  // If user has quit items, pass them to the interactive shrine
  const userQuits = items?.filter(item => item.status === 'quit') || [];
  const shrineItems = userQuits.length > 0
    ? userQuits.map(q => ({
        title: q.title,
        subtitle: q.reason_tag ? `Laid to Rest` : 'Laid to Rest',
        tag: q.reason_tag ? `#${q.reason_tag}` : '#QuietClosure',
        insight: q.reflection || 'A conscious choice to pause and reclaim mental bandwidth.'
      }))
    : undefined;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0]">
      
      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-20 px-4 md:px-8 overflow-hidden flex flex-col items-center justify-center">

        {/* Ambient atmospheric fog layers */}
        <div className="graveyard-fog" aria-hidden="true" />
        <div className="cemetery-ground-mist" aria-hidden="true" />

        {/* Radial glow behind headline */}
        <div className="hero-glow" aria-hidden="true" />

        {/* ── Hero Content Grid (Headline & CTAs on Left, Memorial Shrine on Right) ── */}
        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Typography, Value Proposition & CTA Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">

            {/* Pill badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161A17] border border-[#27362B] text-xs text-[#A8C5B0] shadow-sm backdrop-blur-sm"
              style={{ animation: 'fade-in-up 0.8s ease-out both' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A8C5B0]" />
              <span>Digital Sanctuary for Students</span>
            </div>

            {/* Staggered 3-line headline */}
            <h1 className="font-headline font-extrabold tracking-tight leading-none space-y-1">
              <span
                className="block text-4xl sm:text-5xl md:text-6xl text-[#F5F5F0]"
                style={{ animation: 'fade-in-up 0.9s ease-out 0.1s both' }}
              >
                LET GO.
              </span>
              <span
                className="block text-4xl sm:text-5xl md:text-6xl text-[#A8C5B0]"
                style={{ animation: 'fade-in-up 0.9s ease-out 0.3s both' }}
              >
                FIND CLARITY.
              </span>
              <span
                className="block text-4xl sm:text-5xl md:text-6xl text-[#F5F5F0]"
                style={{ animation: 'fade-in-up 0.9s ease-out 0.5s both' }}
              >
                NO GUILT.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base md:text-lg text-[#8A8A8A] max-w-xl mx-auto lg:mx-0 font-body leading-relaxed"
              style={{ animation: 'fade-in-up 0.9s ease-out 0.7s both' }}
            >
              Gravequit is a quitting journal for students. It captures the real reasons you pause
              courses, habits, and projects in a 10-second flow — turning stopping into self-discovery.
            </p>

            {/* CTA buttons with hover glow */}
            <div
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5"
              style={{ animation: 'fade-in-up 0.9s ease-out 0.9s both' }}
            >
              <div
                className="rounded-button transition-shadow duration-300 w-full sm:w-auto"
                style={{ '--glow': '0 0 22px rgba(168,197,176,0.35)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 22px rgba(168,197,176,0.35)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <Button size="lg" variant="primary" onClick={() => navigate('/items')} className="w-full sm:w-auto">
                  <span>{user ? 'Go to My Items' : 'Start Your Journal'}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              {!user && (
                <Button size="lg" variant="secondary" onClick={() => navigate('/login')} className="w-full sm:w-auto">
                  Log In
                </Button>
              )}
              <Button size="lg" variant="secondary" onClick={() => navigate('/about')} className="w-full sm:w-auto">
                Read Our Story
              </Button>
            </div>

            {/* Reassurance badges */}
            <div
              className="pt-1 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#8A8A8A]"
              style={{ animation: 'fade-in-up 0.9s ease-out 1.1s both' }}
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#A8C5B0]" />
                <span>No streaks or badges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#A8C5B0]" />
                <span>10-second flow</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Memorial Shrine Diorama */}
          <div
            className="lg:col-span-5 flex justify-center"
            style={{ animation: 'fade-in-up 1.0s ease-out 0.4s both' }}
          >
            <MemorialShrine items={shrineItems} />
          </div>

        </div>
      </section>

      {/* The 10-Second Flow Explainer Section */}
      <section className="py-16 px-4 md:px-8 border-t border-[#2A2A2A] bg-[#131313]">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-[#F5F5F0]">
              The 10-Second Reason-Capture Flow
            </h2>
            <p className="text-sm text-[#8A8A8A] max-w-xl mx-auto">
              Most tools ask you to reflect weeks later when the real reason has faded. Gravequit records honest signals at the moment of stopping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card header="1. Log What You Start" headerAccent={true}>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Add a course, habit, skill, or side project with a title, category, and start date. No complicated setup.
              </p>
            </Card>

            <Card header="2. Tap 1 of 5 Valid Reasons" headerAccent={true}>
              <p className="text-sm text-[#8A8A8A] leading-relaxed mb-4">
                When you stop, mark it quit and select strictly one of 5 preset tags right at the moment of decision:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {VALID_REASON_TAGS.map(tag => (
                  <TagPill key={tag} tag={tag} size="sm" />
                ))}
              </div>
            </Card>

            <Card header="3. Discover True Patterns" headerAccent={true}>
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                Over time, receive plain-language AI synthesis grounded strictly in your real numbers — revealing your true cadence.
              </p>
            </Card>

          </div>

        </div>
      </section>

      {/* Insight Without Pressure Section */}
      <section className="py-16 px-4 md:px-8 border-t border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-[#F5F5F0]">
              Insight Without Pressure
            </h2>
            <p className="text-sm text-[#8A8A8A]">
              Built ground-up with a calm, observational tone.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#354F3E] text-[#B0CEB8] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold font-headline text-[#F5F5F0]">Fact-Checked AI Grounding</h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                Every AI insight statement is verified in code against real mathematical stats — preventing hallucinations or fake claims.
              </p>
            </div>

            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#354F3E] text-[#B0CEB8] flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold font-headline text-[#F5F5F0]">Momentum Score</h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                Credits partial progress across all attempts. Formulated to celebrate expanding recovery windows instead of broken streaks.
              </p>
            </div>

            {/* Ghost spirit teaser — resurrection feature placeholder */}
            <div
              className="absolute -top-8 -right-4 animate-ghost-drift hidden md:block"
              style={{ animationDelay: '1s' }}
            >
              <GhostSpiritSVG opacity={0.18} />
            </div>
          </div>

          <div className="text-center pt-8">
            {user ? (
              <Button size="lg" variant="primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" variant="primary" onClick={() => navigate('/login')}>
                Create Student Account
              </Button>
            )}
          </div>

          {/* Product Hunt Embed */}
          <div className="pt-24 pb-12 flex justify-center">
            
            <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-8 shadow-xl max-w-md w-full flex flex-col items-center">
              {/* Product Info Block */}
              <div className="flex items-center gap-4 mb-8 text-left w-full">
                <img 
                  alt="Gravequit" 
                  src="https://ph-files.imgix.net/aa3a9cda-aa26-413a-9fab-b9a5eb9a8a4a.jpeg?auto=compress,format&codec=mozjpeg&cs=strip&fit=crop&h=80&w=80" 
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-lg border border-[#2A2A2A]"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold font-headline text-[#F5F5F0] truncate">Gravequit</h3>
                  <p className="text-sm text-[#8A8A8A] mt-1 leading-snug">Quiet Closure & Quitting Insights for Students</p>
                </div>
              </div>

              {/* PH Badge */}
              <div className="flex flex-col items-center gap-3 w-full border-t border-[#2A2A2A] pt-6">
                <span className="text-[10px] text-[#8A8A8A] font-mono uppercase tracking-widest">As Seen On</span>
                <a 
                  href="https://www.producthunt.com/products/gravequit?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-gravequit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1233273&theme=dark&t=1787770233121" 
                    alt="Gravequit - Quiet Closure & Quitting Insights for Students | Product Hunt" 
                    width="250" 
                    height="54" 
                  />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
