/**
 * GhostSpiritSVG — Translucent spirit figure for recommitted items and landing page teaser.
 * Purely decorative; pointer-events: none, aria-hidden.
 *
 * Props:
 *   opacity   (number)  — Base opacity (default 0.15). Applied to the whole SVG.
 *   className (string)  — Additional classes (positioning, animation delay, size)
 */
export default function GhostSpiritSVG({ opacity = 0.15, className = '' }) {
  return (
    <svg
      width="48"
      height="64"
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, pointerEvents: 'none' }}
      aria-hidden="true"
      role="img"
    >
      {/* Ghost body — rounded dome top, wavy bottom hem */}
      <path
        d="
          M 24,4
          C 10,4 4,14 4,26
          L 4,52
          C 4,52 8,46 12,52
          C 16,58 20,52 24,52
          C 28,52 32,58 36,52
          C 40,46 44,52 44,52
          L 44,26
          C 44,14 38,4 24,4
          Z
        "
        fill="rgba(245, 245, 240, 0.85)"
      />

      {/* Eyes — two soft dark ovals */}
      <ellipse cx="17" cy="26" rx="3.5" ry="4" fill="rgba(10, 10, 10, 0.7)" />
      <ellipse cx="31" cy="26" rx="3.5" ry="4" fill="rgba(10, 10, 10, 0.7)" />

      {/* Inner glow — subtle highlight on dome */}
      <ellipse
        cx="24"
        cy="16"
        rx="10"
        ry="6"
        fill="rgba(255, 255, 255, 0.2)"
      />
    </svg>
  );
}
