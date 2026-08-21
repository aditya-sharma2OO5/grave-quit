# Gravequit — Full Project Explanation

## What This Project Is

Gravequit is a quitting journal for students. It helps them understand *why* they personally keep quitting things — courses, habits, side projects, skills — instead of giving generic motivational advice or shaming them for stopping.

**The core insight:** most self-reflection tools ask you to journal after the fact, when the real reason has already faded. Gravequit captures the reason in a 10-second flow, right at the moment someone quits — this is what makes the resulting data meaningful and honest.

Gravequit is explicitly **NOT**:
- A sobriety or addiction-recovery tracker
- A gamified habit-streak app (no badges, no "days free," no punishing broken streaks)
- A surveillance tool for institutions

The tone throughout is calm, observational, and kind — never clinical, never guilt-inducing, never punitive.

## The Core User Flow

1. A student signs up and adds something they're starting — a course, habit, or skill (title + category + start date).
2. That item is marked **Active**.
3. When the student eventually stops doing it, they mark it **Quit**, which triggers an immediate 10-second reason-capture: tap one preset tag (**Too Busy / Too Hard / Lost Interest / No Deadline / Other**) plus an optional short note or voice note.
4. Over time, the app surfaces patterns across everything the student has quit — average duration, most common reasons, timing patterns — calculated from real numbers first, then phrased gently by AI, never invented or hallucinated.

## System Architecture

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** FastAPI + Postgres
- **AI layer:** Claude API, orchestrated via a multi-agent pipeline (LangGraph)
- **Deployment:** Vercel (frontend) + Render/Railway (backend)

### Core data model

```
users            — id, email, created_at
items            — id, user_id, title, category, status (active / quit / completed), started_at, ended_at
quit_reasons     — id, item_id, reason_tag, reason_text, voice_transcript, created_at
pattern_summaries — id, user_id, computed_stats (JSON), ai_summary_text, generated_at (cached)
```

**Important:** `reason_tag` may ONLY ever be one of these 5 exact values, everywhere in the app, in every dataset and every UI element: `Too Busy`, `Too Hard`, `Lost Interest`, `No Deadline`, `Other`. No other categories should ever be invented, displayed, or used as mock/seed data (e.g. never "Burnout," "Stress," "Boredom," "Social," "Too stressful" — these are not valid values anywhere in this system).

## Full Feature List

### Core features
1. **Add item** — log something you're starting, with title + category + start date.
2. **Mark as quit** — flag an item as quit, which triggers reason capture.
3. **10-second reason capture** — tap a preset tag (from the 5 valid values above) + optional one-line text, right at the moment of quitting.
4. **Deterministic pattern stats** — calculated in plain code, not AI: average days-to-quit, most common reason, timing clusters (e.g. "you quit more near exam season").
5. **AI-phrased summary** — an LLM turns the calculated stats into a plain-language paragraph, without inventing new claims — every claim must be traceable to a real computed number.
6. **Pattern dashboard** — the main screen showing stats + the AI summary.
7. **Cached summaries** — the AI summary regenerates only when a new quit event is logged, not on every page load.

### AI-driven features (Tier 1 & 2)
8. **Predictive quit-risk score** — for any *active* item, a live % chance the user will quit it soon, based on days-active + their own history. Shown with a risk badge (e.g. "High Risk" / "Low Risk").
9. **Semantic clustering of free-text reasons** — groups similar reasons together even when the user never tagged them the same, surfacing hidden patterns beyond the 5 preset tags. Shown as supplementary insight, not a replacement for the 5-tag breakdown.
10. **RAG-style retrieval for summaries** — when generating an insight, the AI retrieves the user's most *similar* past entries (not just the most recent) to ground its phrasing in the most relevant history.
11. **Grounding / fact-check layer** — every AI-generated claim is validated in code against a real stat before being shown to the user. This is the mechanism that proves the app "doesn't hallucinate."
12. **Multi-agent pipeline** — the AI work is split into three agents (via LangGraph): an Extractor (pulls structured signal from raw text/voice), a Pattern agent (finds clusters/stats), and a Narrator (writes the final phrased summary).
13. **"Why this prediction" explainer** — a one-line note showing the single top factor behind a quit-risk score (e.g. "no fixed deadline").
14. **Live-updating risk score** — updates in real time as new data comes in (nice-to-have, not core).

### Product / UX features
15. **Voice note capture** — optionally speak a quit-reason instead of typing (visual mic icon; backend transcription wiring is a stretch goal).
16. **Auto-tag suggestion from voice** — suggests one of the 5 valid reason tags based on a voice transcript.
17. **Momentum score** — a 0–100 score that credits partial progress across all of a user's items, framed positively ("your recovery periods are extending steadily"), never punishing broken streaks.
18. **Comparison mode** — shows a current/new item next to 2–3 of the user's own past items with similar category or duration, so predictions feel grounded in real precedent, not arbitrary.
19. **One-tap re-commit** — for a *quit* item, lets the user instantly start "an easier version" of the same thing instead of just closing it out for good.
20. **Shareable pattern card** — an auto-generated, visually distinct (not a plain UI card — should look like real shareable content) image of one insight, for social/Product Hunt sharing. Includes a reassurance note that only the chosen insight leaves the app, not raw data.

### Business / institutional features
21. **Advisor / institution dashboard** — an opt-in, fully anonymized, aggregate-only view for university wellness/advising offices. Never shows individual student names or identifiable data. Framed explicitly as "highlight patterns, not individuals... inform proactive support, not disciplinary action."
22. **Weekly digest email** — an auto-summary of the week's patterns, sent on an opt-in toggle from Settings.

### Trust / account features
23. **Settings / Account page** — email display, notification toggles (weekly digest, reminder nudges — explicitly "optional and never guilt-based"), data export, and account deletion. The delete-account action is the one place in the entire app where a red/warning color is intentionally used, since it's destructive and irreversible.
24. **Internal team/judge metrics dashboard** — NOT user-facing. An internal-only page showing real product numbers (total users, items logged, quit events, AI accuracy rate from thumbs-up/down feedback, daily active users trend, recent activity feed) — used by the founding team to demonstrate real traction during a hackathon demo.

## The 13 Pages / Screens

1. **Landing Page** (public) — hero, "The 10-second flow" explainer, "Insight without pressure" section, closing CTA
2. **Login / Sign Up Page** (public) — email/password auth, social login options, privacy commitment note
3. **My Items Page** (authenticated home) — Currently Active items + Past Observations, Add Item entry point
4. **Pattern Dashboard** — AI Synthesis quote, Average Duration, Momentum Score, Primary Reasons (5-tag breakdown), Current Quit-Risk Assessment
5. **Add Item flow** (modal) — title, category (pill select), start date, optional note
6. **Quit Flow** (modal) — the 10-second reason capture: target item shown, 5 reason-tag pills, optional note + mic icon, "Save & Let Go" action
7. **Item Detail Page** — has two states:
   - *Active state:* Quit-Risk Assessment card + Similar Past Attempts (comparison mode)
   - *Quit/Concluded state:* Re-commit card ("Not ready to fully let this go?") + Similar Past Attempts
8. **Settings / Account Page** — Account info, Notifications toggles, Your Data (export/delete), privacy note
9. **Advisor / Institution Dashboard** — Cohort Insights, opt-in/anonymized badge, summary stats, disengagement trend chart, Closure Drivers (5-tag breakdown), ethical framing note
10. **Internal Judge/Team Metrics Page** — headline stats, AI accuracy + feedback breakdown, DAU chart, recent activity feed
11. **Shareable Insight Page** — large preview card (visually distinct styling, not a plain UI card), insight-type selector, Download Image / Copy Link actions
12. **About / Story Page** (public) — "Why We Built This" narrative, pull-quote, "What This Isn't" section, closing CTA
13. **Privacy & Data Page** (public) — What We Collect, What We Never Do, Voice & Text Handling, Your Controls, Institutional Data sections, Contact link

## Tone & Ethics (apply throughout the entire app, every page, every microcopy string)

- Never use words like "free," "clean," "relapse," or any sobriety/recovery-app language.
- Never use red/alert styling or punitive language for quitting — quitting is treated as information, not failure. (The single exception is the Delete Account button on Settings, which is destructive and irreversible.)
- No streaks, no badges, no gamification, no guilt-based notifications.
- Every AI-generated insight must be traceable to a real, computed statistic — never an invented or unverifiable claim.
- The Advisor Dashboard must never expose individual, identifiable student data — aggregate and anonymized only, opt-in only.
