import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame, Sparkles } from 'lucide-react';

/**
 * MemorialShrine
 * Centered 3D isometric digital memorial altar & shrine artpiece.
 * Features:
 * - 100% seamless background melt (zero rectangular outline)
 * - Ornate twin memorial diya lamps matching user reference
 * - 0.2s ignition delay with smooth flame transition directly on the candle wick
 * - No floating or off-center halo artifacts
 * - Selective rekindling (re-ignites only the extinguished candle)
 * - Hover tooltip with emoji on top and "Blow out" below (no native browser tooltip)
 * - Perfect blow-out animation with rising smoke wisp
 * - Miniature base candles modeled after candle_diya (perpetually lit)
 */

const DEFAULT_HABITS = [
  {
    title: "5:00 AM Routine",
    subtitle: "Died on Day 4",
    tag: "#WrongTiming",
    insight: "Early alarms clash with night-owl biology. Quitting wasn't failure — it was circadian alignment."
  },
  {
    title: "Learn Rust",
    subtitle: "7 mos dormant",
    tag: "#Overwhelmed",
    insight: "The borrow checker steepened the cliff. Pausing let you prioritize your thesis first."
  },
  {
    title: "Side SaaS Project",
    subtitle: "Died at Auth flow",
    tag: "#Overthinking",
    insight: "Designing for 10,000 hypothetical users before launch. Pausing saved months of code churn."
  },
  {
    title: "Novel (Ch. 2)",
    subtitle: "1,400 words written",
    tag: "#LostMomentum",
    insight: "Forcing daily word quotas drained the spark. Put in cold storage until inspiration returns."
  },
  {
    title: "52 Books Year",
    subtitle: "Died at Book 3",
    tag: "#UnrealisticGoal",
    insight: "Arbitrary speed-reading quantified away the joy of reading. Laid to rest without guilt."
  },
];

/**
 * MiniatureDiya
 * Miniature base votive diya lamp modeled after the main ornate diya lamp.
 * Always lit, immune to clicks.
 */
function MiniatureDiya({ top, left, size = 26 }) {
  return (
    <div
      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center select-none"
      style={{ top, left, width: `${size}px`, height: `${size}px`, zIndex: 12 }}
      aria-hidden="true"
    >
      <img
        src="/candle_diya_lit.png"
        alt=""
        className="w-full h-full object-contain pointer-events-none select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
      />
    </div>
  );
}

export default function MemorialShrine({ items = [], onSelect }) {
  const habits = items.length > 0 ? items : DEFAULT_HABITS;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Individual Candle states (both unlit initially)
  const [leftCandleLit, setLeftCandleLit] = useState(false);
  const [rightCandleLit, setRightCandleLit] = useState(false);

  // Smoke states when blown out (preserved untouched)
  const [leftSmoke, setLeftSmoke] = useState(false);
  const [rightSmoke, setRightSmoke] = useState(false);

  // Delay flow state
  const [isKindling, setIsKindling] = useState(false);

  const kindlingTimeoutRef = useRef(null);

  const current = habits[currentIndex % habits.length];

  const anyCandleLit = leftCandleLit || rightCandleLit;
  const allCandlesLit = leftCandleLit && rightCandleLit;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + habits.length) % habits.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % habits.length);
  };

  // Kindle Candle flow: 0.2s delay then smooth organic flame catch
  // If one candle is already lit, ONLY rekindles the unlit candle!
  const handleKindleAction = (e) => {
    e.stopPropagation();
    if (isKindling) return;
    if (allCandlesLit) return;

    setIsKindling(true);

    if (kindlingTimeoutRef.current) clearTimeout(kindlingTimeoutRef.current);

    kindlingTimeoutRef.current = setTimeout(() => {
      const needLeft = !leftCandleLit;
      const needRight = !rightCandleLit;

      if (needLeft) {
        setLeftCandleLit(true);
      }

      if (needRight) {
        setRightCandleLit(true);
      }

      setIsKindling(false);
    }, 200); // exactly 0.2 second delay as requested
  };

  // Individual candle click to blow out (preserved untouched)
  const handleBlowOutLeft = (e) => {
    e.stopPropagation();
    if (!leftCandleLit) return;
    setLeftCandleLit(false);
    setLeftSmoke(true);
    setTimeout(() => setLeftSmoke(false), 1200);
  };

  const handleBlowOutRight = (e) => {
    e.stopPropagation();
    if (!rightCandleLit) return;
    setRightCandleLit(false);
    setRightSmoke(true);
    setTimeout(() => setRightSmoke(false), 1200);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none py-2">
      
      {/* ── 3D Isometric Shrine Artpiece Container ── */}
      <div className="relative w-[340px] sm:w-[420px] md:w-[460px] aspect-square flex items-center justify-center">
        
        {/* Soft Ambient Moonlight Aura Behind Shrine */}
        <div className="absolute inset-0 bg-radial from-[#A8C5B0]/8 via-transparent to-transparent blur-3xl pointer-events-none" />

        {/* 
          Shrine Isometric Diorama Image
          Applies radial gradient mask so edges melt 100% seamlessly into #0A0A0A (zero rectangular outline)
        */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            maskImage: 'radial-gradient(ellipse 76% 74% at 50% 50%, black 50%, transparent 92%)',
            WebkitMaskImage: 'radial-gradient(ellipse 76% 74% at 50% 50%, black 50%, transparent 92%)',
          }}
        >
          <img
            src="/memorial_shrine_diorama.png"
            alt="Gravequit Memorial Shrine"
            className="w-full h-full object-contain pointer-events-none select-none"
            loading="eager"
          />
        </div>

        {/* ── MAIN INTERACTIVE DIYA CANDLE 1 (LEFT STONE STEP) ── */}
        <div
          id="candle-left"
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            top: '49.0%',
            left: '37.0%',
            width: '64px',
            height: '64px',
            zIndex: 15,
          }}
          onClick={handleBlowOutLeft}
        >
          {/* Diya Candle Body: Smooth transition between dormant wick and lit wick */}
          <div className="relative w-full h-full pointer-events-none transition-transform duration-300 group-hover:scale-105">
            <img
              src="/candle_diya_unlit.png"
              alt="Left Diya Dormant"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ease-out ${
                leftCandleLit ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src="/candle_diya_lit.png"
              alt="Left Diya Kindled"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ease-out ${
                leftCandleLit ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Smoke plume wisp when blown out (preserved untouched) */}
          {leftSmoke && (
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
              style={{ top: '15%', animation: 'smoke-drift 1.2s ease-out forwards' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px]" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400/50 blur-[1.5px] mt-1" />
            </div>
          )}

          {/* Hover blow-out cue: emoji on top, text below, no native title tooltip */}
          {leftCandleLit && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-[#0E1210]/95 text-[#A8C5B0] px-2 py-0.5 rounded-md border border-[#2D3B31]/80 shadow-md flex flex-col items-center gap-0.5 whitespace-nowrap z-30">
              <span className="text-[0.65rem] leading-none">🌬️</span>
              <span className="text-[0.54rem] font-medium tracking-wide">Blow out</span>
            </div>
          )}
        </div>

        {/* ── MAIN INTERACTIVE DIYA CANDLE 2 (RIGHT STONE STEP) ── */}
        <div
          id="candle-right"
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            top: '57.8%',
            left: '54.8%',
            width: '64px',
            height: '64px',
            zIndex: 15,
          }}
          onClick={handleBlowOutRight}
        >
          {/* Diya Candle Body: Smooth transition between dormant wick and lit wick */}
          <div className="relative w-full h-full pointer-events-none transition-transform duration-300 group-hover:scale-105">
            <img
              src="/candle_diya_unlit.png"
              alt="Right Diya Dormant"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ease-out ${
                rightCandleLit ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src="/candle_diya_lit.png"
              alt="Right Diya Kindled"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ease-out ${
                rightCandleLit ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Smoke plume wisp when blown out (preserved untouched) */}
          {rightSmoke && (
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
              style={{ top: '15%', animation: 'smoke-drift 1.2s ease-out forwards' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/40 blur-[1px]" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400/50 blur-[1.5px] mt-1" />
            </div>
          )}

          {/* Hover blow-out cue: emoji on top, text below, no native title tooltip */}
          {rightCandleLit && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-[#0E1210]/95 text-[#A8C5B0] px-2 py-0.5 rounded-md border border-[#2D3B31]/80 shadow-md flex flex-col items-center gap-0.5 whitespace-nowrap z-30">
              <span className="text-[0.65rem] leading-none">🌬️</span>
              <span className="text-[0.54rem] font-medium tracking-wide">Blow out</span>
            </div>
          )}
        </div>

        {/* ── MINIATURE DIYA CANDLES AT BASE (PERPETUALLY LIT, MODELED AFTER CANDLE_DIYA) ── */}
        <MiniatureDiya top="74.0%" left="21.0%" size={26} />
        <MiniatureDiya top="79.5%" left="33.5%" size={25} />
        <MiniatureDiya top="84.0%" left="46.0%" size={25} />
        <MiniatureDiya top="67.0%" left="67.0%" size={23} />
        <MiniatureDiya top="73.0%" left="78.0%" size={26} />

        {/* ── INSCRIBED STONE TABLET TYPOGRAPHY ── */}
        <div
          className="absolute pointer-events-none flex flex-col items-center text-center -translate-x-1/2"
          style={{
            top: '25.5%',
            left: '49.3%',
            width: '135px',
            zIndex: 10,
          }}
        >
          {/* Classical R.I.P. Inscription */}
          <span
            className="font-cinzel text-[0.58rem] font-bold uppercase tracking-[0.3em] text-[#A8C5B0]/75 mb-0.5"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 -1px 1px rgba(255,255,255,0.15)',
            }}
          >
            R.I.P.
          </span>

          {/* Habit Title */}
          <h3
            key={current.title}
            className="font-cinzel text-[0.72rem] sm:text-[0.80rem] font-bold text-[#E5E8E2] uppercase tracking-wider leading-snug max-w-[95%] animate-fade-in"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.9), 0 -1px 1px rgba(255,255,255,0.12)',
            }}
          >
            {current.title}
          </h3>

          {/* Delicate Carved Flourish */}
          <div
            className="w-8 h-[1px] my-1 opacity-35"
            style={{
              background: 'linear-gradient(90deg, transparent, #A8C5B0, transparent)',
            }}
          />

          {/* Subtitle / Epitaph */}
          <p
            className="font-body text-[0.60rem] sm:text-[0.64rem] text-[#9EA49D] font-medium leading-tight"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.95)',
            }}
          >
            {current.subtitle}
          </p>

          {/* Reason Tag Pill */}
          {current.tag && (
            <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#121814]/90 border border-[#3E5642]/60 shadow-sm backdrop-blur-[2px]">
              <span
                className="font-mono text-[#A8C5B0] font-semibold text-[0.52rem] tracking-wider"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                }}
              >
                {current.tag}
              </span>
            </div>
          )}
        </div>

        {/* ── Shrine Navigation Carousel Buttons ── */}
        <button
          onClick={handlePrev}
          aria-label="Previous memorial habit"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#161616]/80 hover:bg-[#222222] border border-[#2E2E2E] text-[#C4C4BC] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next memorial habit"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#161616]/80 hover:bg-[#222222] border border-[#2E2E2E] text-[#C4C4BC] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* ── Interactive Shrine Controls & Psychological Reflection ── */}
      <div className="w-full max-w-md px-4 mt-1 flex flex-col items-center text-center space-y-3">
        
        {/* Psychological Insight Card */}
        {current.insight && (
          <div className="w-full p-3 rounded-xl bg-[#141414]/90 border border-[#262626] shadow-md backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#A8C5B0] font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quiet Closure Signal</span>
            </div>
            <p className="text-xs text-[#999990] leading-relaxed italic">
              "{current.insight}"
            </p>
          </div>
        )}

        {/* Carousel Indicators and Kindle Candle Action Button */}
        <div className="flex items-center justify-between w-full pt-1 px-2">
          
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {habits.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View habit ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex % habits.length === idx
                    ? 'w-6 bg-[#A8C5B0]'
                    : 'w-1.5 bg-[#333333] hover:bg-[#555555]'
                }`}
              />
            ))}
          </div>

          {/* Kindle Candle Action Button */}
          <button
            id="kindle-candle-btn"
            onClick={handleKindleAction}
            disabled={isKindling || allCandlesLit}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer ${
              allCandlesLit
                ? 'bg-[#2A2012] border-[#E8C87A]/60 text-[#E8C87A] shadow-[0_0_12px_rgba(232,200,122,0.25)] cursor-default'
                : anyCandleLit
                ? 'bg-[#221C14] border-[#E8C87A]/40 text-[#E8C87A] hover:border-[#E8C87A]/80 shadow-sm'
                : isKindling
                ? 'bg-[#2A2012] border-[#E8C87A]/60 text-[#E8C87A] animate-pulse cursor-wait'
                : 'bg-[#181818] border-[#2C2C2C] text-[#A0A098] hover:text-[#E8C87A] hover:border-[#E8C87A]/40'
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                allCandlesLit || isKindling ? 'text-[#E8C87A] animate-pulse' : 'text-[#A0A098]'
              }`}
            />
            <span>
              {isKindling
                ? 'Kindling...'
                : allCandlesLit
                ? 'Candles Kindled'
                : anyCandleLit
                ? 'Kindle Candle'
                : 'Kindle Candles'}
            </span>
          </button>
        </div>

        {/* Subtle helper hint for visitors */}
        <p className="text-[0.62rem] text-[#6E736D] tracking-wide">
          {allCandlesLit
            ? 'Tip: Hover and tap either candle to blow it out.'
            : anyCandleLit
            ? 'One flame burns. Tap the lit candle to extinguish, or kindle the unlit one.'
            : 'Tap "Kindle Candles" to honor this journey.'}
        </p>

      </div>

    </div>
  );
}
