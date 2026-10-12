/**
 * GravestoneSVG — Decorative gravestone shape for quit items and landing page.
 * Pure presentational; aria-hidden by default (all decorative).
 *
 * Props:
 *   text      (string)  — Engraved inscription (item title or placeholder)
 *   size      ('sm' | 'md' | 'lg') — Controls SVG dimensions
 *   withCandle (bool)   — Show flickering candle dot at base
 *   className (string)  — Additional classes (e.g. positioning, animation delay)
 */

const SIZES = {
  sm: { width: 60,  height: 80,  rx: 30, fontSize: 7,  textY: 44 },
  md: { width: 90,  height: 120, rx: 45, fontSize: 9,  textY: 64 },
  lg: { width: 120, height: 160, rx: 60, fontSize: 11, textY: 86 },
};

export default function GravestoneSVG({
  text = '',
  size = 'md',
  withCandle = false,
  className = '',
}) {
  const { width, height, rx, fontSize, textY } = SIZES[size] ?? SIZES.md;
  const cx = width / 2;
  // Gravestone path: rounded arch top, flat bottom sides
  const path = `
    M ${cx},4
    a ${rx},${rx} 0 0 1 ${rx},${rx}
    L ${width - 4},${height - 4}
    L 4,${height - 4}
    L 4,${rx + 4}
    a ${rx},${rx} 0 0 1 ${cx - 4},${-(rx)}
    Z
  `;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      {/* Stone body */}
      <path
        d={path}
        fill="#1A1A1A"
        stroke="#5A7A5E"
        strokeWidth="1.5"
      />

      {/* Subtle inner highlight — moss tint at top */}
      <ellipse
        cx={cx}
        cy={rx + 8}
        rx={rx * 0.55}
        ry={rx * 0.3}
        fill="rgba(90, 122, 94, 0.08)"
      />

      {/* Engraved text — wraps at ~12 chars per line */}
      {text && (
        <text
          x={cx}
          y={textY}
          textAnchor="middle"
          fontSize={fontSize}
          fontFamily="Manrope, sans-serif"
          fontWeight="700"
          fill="rgba(168, 197, 176, 0.55)"
          letterSpacing="0.04em"
        >
          {/* Split long text across two lines */}
          {text.length > 12 ? (
            <>
              <tspan x={cx} dy="0">{text.slice(0, 12)}</tspan>
              <tspan x={cx} dy={fontSize + 2}>{text.slice(12, 24)}</tspan>
            </>
          ) : (
            text
          )}
        </text>
      )}

      {/* Optional candle dot with flicker animation */}
      {withCandle && (
        <circle
          cx={cx}
          cy={height - 10}
          r={3}
          fill="#E8C87A"
          style={{ animation: 'candle-flicker 2s ease-in-out infinite' }}
        />
      )}
    </svg>
  );
}
