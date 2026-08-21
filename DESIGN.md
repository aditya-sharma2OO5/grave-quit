---
name: Graveyard
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c5c7c1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f918c'
  outline-variant: '#454843'
  surface-tint: '#c6c7c2'
  primary: '#ffffff'
  on-primary: '#2f312e'
  primary-container: '#e3e3de'
  on-primary-container: '#636561'
  inverse-primary: '#5d5f5b'
  secondary: '#b0ceb8'
  on-secondary: '#1c3627'
  secondary-container: '#354f3e'
  on-secondary-container: '#a2bfab'
  tertiary: '#ffffff'
  on-tertiary: '#352f30'
  tertiary-container: '#ebe0e1'
  on-tertiary-container: '#6a6364'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e3e3de'
  primary-fixed-dim: '#c6c7c2'
  on-primary-fixed: '#1a1c19'
  on-primary-fixed-variant: '#454744'
  secondary-fixed: '#ccead4'
  secondary-fixed-dim: '#b0ceb8'
  on-secondary-fixed: '#062013'
  on-secondary-fixed-variant: '#334c3c'
  tertiary-fixed: '#ebe0e1'
  tertiary-fixed-dim: '#cec4c5'
  on-tertiary-fixed: '#1f1a1b'
  on-tertiary-fixed-variant: '#4c4546'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 800px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
  section-gap: 64px
---

## Brand & Style

The design system is built on a philosophy of "quiet closure." It serves as a digital sanctuary for students to retire habits, projects, or commitments without the guilt or noise of traditional productivity apps. The personality is observational and kind, acting as a steady witness rather than a coach.

The visual style is **Minimalist-Noir**. It prioritizes deep focus through a dark-mode-only interface, high-quality typography, and significant negative space. By removing all traces of gamification—no streaks, no badges, no "leveling up"—the design focuses purely on the clarity of the user's reflection. Elements are grounded in a structured, calm layout that encourages slow interaction.

## Colors

The palette is intentionally restrained to prevent cognitive load and emotional overstimulation.

- **Foundation:** The `#0A0A0A` background provides a void-like depth, while `#1A1A1A` defines surfaces for reflection.
- **Typography:** Primary text uses an off-white `#F5F5F0` to reduce the harshness of pure white on black, while secondary metadata uses a muted grey `#8A8A8A`.
- **Accent:** The Sage Green `#A8C5B0` is the only "living" color, used exclusively for moments of growth or significant peace. It should never be used for "warnings" or "alerts."
- **Status:** Avoid red, orange, or yellow for most of the app. Failure is not a concept here; only "ending" exists. Use opacity shifts or subtle border thickness to indicate state changes instead of color-coding. The single exception is the destructive "Delete Account" action on the Settings page, where a muted red/warning tone is intentionally used since it is a permanent, irreversible action.

## Typography

This design system utilizes a pairing of **Manrope** for headlines and **Inter** for functional text.

Headlines should be bold and authoritative, yet the rounded geometric nature of Manrope keeps them from feeling aggressive. Large "XL" headlines are used for entry titles or date markers to give the feeling of a physical journal. Body text is set in Inter with generous line-height to ensure maximum legibility during long-form reflection. All labels should be clear and concise, occasionally using uppercase for subtle architectural distinction without shouting.

## Layout & Spacing

The layout philosophy follows a **Fixed Central Column** model for public/marketing pages, but app-shell pages (My Items, Dashboard, Settings, etc.) use a **full-width layout**: fixed sidebar on the left, main content area filling the remaining width, footer spanning full width at the bottom. Content should never be squeezed into a narrow column with empty space beside it on app-shell pages.

- **Grid:** A simple 8px rhythmic system.
- **Whitespace:** Emphasize vertical rhythm. Between different journal entries or sections, use a "Section Gap" of 64px to allow the eye to rest.
- **Mobile:** Margins shrink to 20px, and the layout collapses into a single vertical stack.
- **Padding:** Internal card padding should be generous (min 24px) to ensure content never feels cramped against borders.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layering** rather than traditional shadows.

- **Level 0:** The `#0A0A0A` base background.
- **Level 1:** Cards and containers use `#1A1A1A`.
- **Level 2:** Modals or hovering elements use `#222222` with a subtle 1px border of `#2A2A2A`.

Shadows, if used at all, should be extremely soft, low-opacity (#000000, 40%) and spread wide (20px-40px) to feel like an ambient glow rather than a physical lift. The goal is a flat, architectural feel where layers are distinguished by subtle shifts in grey.

## Shapes

The shape language is "Soft Geometric." Most UI elements use a 12px to 16px corner radius. This avoids the clinical feel of sharp corners while maintaining the structural integrity of a geometric design. Large cards should feel like smooth stones—substantial and tactile. Buttons use a slightly more pronounced roundedness (16px) to distinguish them from structural containers.

## Global Components (use identically on every page — do not restyle per page)

- **Top Navigation (authenticated pages):** Logo 'Graveyard' left, nav links 'My Items / Dashboard / Insights' center-right, profile icon far right. Sidebar subtitle under the logo always reads exactly **"Quiet Closure"** — never any other variant (e.g. not "Digital Sanctuary," not "Quiet Sanctuary").
- **Footer:** Always reads exactly **"© 2026 Graveyard AI. Precision in Letting Go."** on the left, and **"Privacy Policy · Terms of Service · Ethics"** on the right, on every single page without exception.
- **Buttons:**
    - *Primary:* Solid `#F5F5F0` fill with `#0A0A0A` text. High contrast, used for the main action of a page (e.g. "Start your journal," "Add to My Items," "Save & Let Go").
    - *Secondary:* `#1A1A1A` fill with a 1px `#2A2A2A` border and `#F5F5F0` text.
    - *Destructive (Settings page only):* muted red/warning outline, used only for "Delete Account."
- **Input Fields:** Dark fill or bottom-border style only — `#1A1A1A` background or a 1px `#2A2A2A` bottom border. Never use white/light-filled input fields; this breaks the dark theme.
- **Cards:** 1px `#2A2A2A` border, `#1A1A1A` background, 12–16px corner radius. Headers within cards use the accent `#A8C5B0` for emphasis when relevant.
- **Chips/Tags (Reason Tags):** Small, pill-shaped markers using `#1A1A1A` background and `#8A8A8A` text (sage-green `#A8C5B0` outline when selected/active). Used for categorizing why something was quit. **The only valid values, everywhere in the app, are: Too Busy, Too Hard, Lost Interest, No Deadline, Other.** Do not invent new categories (e.g. never use "Burnout," "Stress/Overwork," "Boredom," "Social," or "Too stressful" — these are not part of the system).
- **Lists:** Clean, unstyled rows with subtle divider lines. Interaction is indicated by a slight shift in background color to `#222222`.
- **Abstract Imagery:** Soft, blurred gradients using the accent color at low opacity (10-20%) can be used as background decorations for empty states or shareable/marketing cards, suggesting a morning fog or dusk. When text sits on top of this imagery, add a semi-transparent dark overlay (black, 40–50% opacity) between the gradient and the text to guarantee legibility.
