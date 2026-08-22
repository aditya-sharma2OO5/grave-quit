# Gravequit Backend — Internal Bug Log
> Internal documentation only. Do NOT commit or push this file.
> For open issues, see code_review.md in the artifacts directory.

---

## Fixes Done

---

### BUG-001 — Duplicate `MockUser` class across routers
**Severity:** High (Bug Risk)
**Fixed:** 2026-08-22
**Files affected:**
- `backend/routers/items.py`
- `backend/routers/patterns.py`

**Problem:**
Both `routers/items.py` and `routers/patterns.py` independently defined their own
`MockUser` class and `get_current_user()` function. When real Supabase auth is integrated,
this would have required updating two separate files, with a high risk of them going out of
sync and causing subtle auth bugs.

**Fix:**
Created a single `backend/auth.py` file containing the shared `MockUser` and
`get_current_user()` dependency. Both routers now import from it:

    from auth import get_current_user

The `auth.py` file also contains a TODO comment showing exactly how to replace `MockUser`
with a real JWT validation check when the Supabase integration is ready.

---

### BUG-002 — `ai_summary.py` is redundant with `pipeline.py`
**Severity:** High (Architectural gap)
**Fixed:** 2026-08-22
**Files affected:**
- `backend/routers/patterns.py`
- `backend/ai_summary.py` (kept as lightweight fallback)

**Problem:**
The `/patterns/summary` API endpoint was still calling the old, standalone `ai_summary.py` file to generate the AI summary. This meant it bypassed all the LangGraph agents (Extractor, Pattern, Narrator) built during Day 5, losing the clustering, RAG context, and grounding validation.

**Fix:**
1. Updated `routers/patterns.py` to call `run_pipeline()` from `pipeline.py`.
2. Passed the full `items` history and `reason_texts` to the pipeline so the Pattern agent can perform clustering and similarity search.
3. Added a try/except block in the router that calls the standalone `ai_summary.py` as a lightweight fallback if the full pipeline fails.

---

### BUG-005 & BUG-006 — Missing Items CRUD & Quit Flow
**Severity:** Medium (Missing Features)
**Fixed:** 2026-08-22
**Files affected:**
- `backend/routers/items.py`
- `backend/schemas.py`

**Problem:**
The frontend had no API endpoints to list items, create items, or execute the core 10-second quit flow.

**Fix:**
1. Created `ItemCreate`, `ItemResponse`, `QuitRequest`, and `QuitResponse` schemas.
2. Implemented `GET /items` and `POST /items` endpoints.
3. Implemented `PATCH /items/{id}/quit` which sets the item status to 'quit', records the `QuitReason`, and implicitly invalidates the AI pattern summary cache by changing the `total_quit` count.

---

## Open Bugs

See the active items in code_review.md (artifacts directory).
