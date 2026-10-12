import React from 'react';

/**
 * GravestoneSVG / GravestoneCard
 * Custom photorealistic weathered gravestone with authentic Roman chiseled typography (Cinzel),
 * dark slate texture, moss, ivy vines, and atmospheric memorial candle lamp.
 *
 * Props:
 *   text       (string)             — Habit or task title
 *   subtitle   (string, optional)   — Epitaph or reason tag (e.g. "Died on Day 4 • #WrongTiming")
 *   size       ('sm' | 'md' | 'lg') — Scaled dimensions (10% smaller)
 *   variant    ('arch' | 'gothic' | 'baroque') — Distinct architectural stone styles
 *   withCandle (bool)               — Show warm memorial diya/candle at stone base
 *   className  (string)             — Additional utility classes
 */

const DIMENSIONS = {
  sm: { width: '175px', height: '235px', titleSize: '0.78rem', subSize: '0.56rem' },
  md: { width: '220px', height: '295px', titleSize: '0.88rem', subSize: '0.62rem' },
  lg: { width: '265px', height: '355px', titleSize: '0.98rem', subSize: '0.68rem' },
};

// Precise tablet coordinates for each architectural style
const VARIANT_CONFIGS = {
  arch: {
    src: '/stone_arch.png',
    topOffset: '30%',
    width: '74%',
  },
  gothic: {
    src: '/stone_gothic.png',
    topOffset: '36%',
    width: '68%',
  },
  baroque: {
    src: '/stone_baroque.png',
    topOffset: '34%',
    width: '74%',
  },
};

export default function GravestoneSVG({
  text = '',
  subtitle = '',
  size = 'lg',
  variant = 'arch',
  withCandle = false,
  className = '',
}) {
  const dims = DIMENSIONS[size] ?? DIMENSIONS.lg;
  // Normalize legacy variant names
  let normalizedVariant = variant;
  if (variant === 'monument') normalizedVariant = 'baroque';
  if (!VARIANT_CONFIGS[normalizedVariant]) normalizedVariant = 'arch';

  const config = VARIANT_CONFIGS[normalizedVariant];

  // Parse subtitle into Epitaph and Reason Tag
  let epitaph = subtitle;
  let tag = '';
  if (subtitle.includes('•')) {
    const parts = subtitle.split('•').map(s => s.trim());
    epitaph = parts[0];
    tag = parts[1];
  }

  return (
    <div
      className={`relative select-none inline-block transition-transform duration-500 hover:scale-[1.02] ${className}`}
      style={{
        width: dims.width,
        height: dims.height,
      }}
      aria-hidden="true"
    >
      {/* ── 1. Weathered Stone Silhouette with Anti-Aliased Alpha Transparency ── */}
      <img
        src={config.src}
        alt=""
        className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
        loading="eager"
      />

      {/* ── 2. Chiseled Roman Inscription (Cinzel Typeface) ── */}
      {/* Centered directly inside the recessed, flat stone tablet face */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center pointer-events-none px-4"
        style={{
          top: config.topOffset,
          width: config.width,
        }}
      >
        {/* R.I.P. Classical Inscription */}
        <span
          className="font-cinzel font-bold uppercase text-[#A8C5B0] opacity-60 tracking-[0.3em] mb-1"
          style={{
            fontSize: '0.62rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 -1px 1px rgba(255,255,255,0.15)',
          }}
        >
          R.I.P.
        </span>

        {/* Habit / Project Title in Chiseled Roman Serif */}
        {text && (
          <h4
            className="font-cinzel font-bold text-[#E5E8E2] uppercase tracking-wider leading-tight max-w-[92%]"
            style={{
              fontSize: dims.titleSize,
              textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 1px 2px rgba(0,0,0,0.9), 0 -1px 1px rgba(255,255,255,0.12)',
            }}
          >
            {text}
          </h4>
        )}

        {/* Subtle Carved Flourish Divider */}
        <div
          className="w-10 h-[1px] my-1 opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, #A8C5B0, transparent)',
          }}
        />

        {/* Epitaph (e.g., "Died on Day 4") */}
        {epitaph && (
          <p
            className="font-body text-[#9EA49D] font-medium leading-snug max-w-[90%]"
            style={{
              fontSize: dims.subSize,
              textShadow: '0 2px 4px rgba(0,0,0,0.95)',
            }}
          >
            {epitaph}
          </p>
        )}

        {/* Reason Tag Badge (e.g., "#WrongTiming") — Carved Slate Pill */}
        {tag && (
          <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full bg-[#141A16]/90 border border-[#3E5642]/60 shadow-sm backdrop-blur-[2px]">
            <span
              className="font-mono text-[#A8C5B0] font-semibold text-[0.60rem] tracking-wider"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}
            >
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* ── 3. Atmospheric Memorial Candle Lamp Resting in the Autumn Grass ── */}
      {withCandle && (
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
          style={{ zIndex: 10 }}
        >
          {/* Ambient Warm Golden Aura Glow on Ground and Grass */}
          <div className="absolute -top-3 w-12 h-12 rounded-full bg-[#E8C87A]/35 blur-md animate-pulse" />

          {/* Flickering Teardrop Flame */}
          <div className="relative w-4 h-5 flex items-center justify-center">
            {/* Outer flame glow */}
            <div
              className="w-3 h-4 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] bg-gradient-to-t from-[#FF6D00] via-[#FFA726] to-[#FFE082] shadow-[0_0_10px_#FFA726]"
              style={{ animation: 'candle-flicker 1.8s ease-in-out infinite' }}
            />
            {/* Inner flame core */}
            <div className="absolute bottom-0.5 w-1.5 h-2.5 rounded-full bg-[#FFFDE7]" />
          </div>

          {/* Dark Clay / Bronze Diya Bowl Vessel */}
          <div className="w-6 h-2.5 rounded-b-full bg-[#201710] border-t border-[#D4A373]/80 shadow-[0_2px_5px_rgba(0,0,0,0.95)]" />
        </div>
      )}
    </div>
  );
}
