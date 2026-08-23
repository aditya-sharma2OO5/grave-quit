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

### BUG-007 — ML model trained on synthetic data
**Severity:** Low (Polish)
**Fixed:** 2026-08-22
**Files affected:**
- `backend/ml_model.py`
- `backend/routers/admin.py` (new)
- `backend/main.py`

**Problem:**
The quit-risk model was originally hardcoded to train on 8 synthetic rows, meaning it couldn't adapt to real user behavior in production.

**Fix:**
Created an administrative endpoint (`POST /admin/retrain`) that fetches all historical "quit" and "completed" items from the real database, computes the actual feature distributions, and dynamically retrains the `risk_model.pkl` on real human behavior. (Note: Added a task in `TODO.md` to secure this endpoint before launch).

---

### BUG-008 & BUG-009 — Code Quality (Deprecations & Imports)
**Severity:** Low (Polish)
**Fixed:** 2026-08-22
**Files affected:**
- `backend/models.py`, `backend/routers/items.py`, `backend/routers/patterns.py`, `backend/pipeline.py`, `backend/test_stats.py`

**Fix:**
1. Replaced all deprecated `datetime.utcnow()` calls with Python 3.11+ compatible `datetime.now(timezone.utc)`.
2. Moved `import re` from inside the `narrator_agent` function to the top of `pipeline.py` for PEP 8 compliance.

---

### BUG-010 & BUG-011 — Polish (Module Init & Secrets Validation)
**Severity:** Low (Polish)
**Fixed:** 2026-08-22
**Files affected:**
- `backend/routers/__init__.py` (new)
- `backend/pipeline.py`

**Fix:**
1. Added an empty `__init__.py` to `backend/routers/` to ensure Python and test discovery tools treat it as a proper module.
2. Added an explicit `ValueError` guard in `pipeline.py` that fails fast if `GROQ_API_KEY` is not set in `.env`, preventing cryptic Langchain errors.

### BUG-012 — Test database committed to git (Data Leak)
**Severity:** Critical (Security)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/test_gravequit.db` (removed from tracking)
- `backend/.gitignore` (added `*.db` and `*.sqlite3` rules)

**Problem:**
`backend/test_gravequit.db` (a 28KB SQLite database containing test user emails, hashed passwords, quit reasons, and AI feedback) was being tracked by git and pushed to GitHub. Anyone browsing the public repository could download it.

**Fix:**
1. Ran `git rm --cached backend/test_gravequit.db` to untrack the file without deleting it locally.
2. Added `*.db` and `*.sqlite3` patterns to `backend/.gitignore` to prevent any future test databases from being committed.

> **Note for all devs:** If you need to share test fixtures, use seed scripts or JSON files instead of committing binary database files.

### BUG-013 — `pipeline.py` crashes entire server if GROQ_API_KEY is missing
**Severity:** Critical (Bug)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/pipeline.py`

**Problem:**
1. The `GROQ_API_KEY` validation at line 29 raised a `ValueError` at **module import time**. Since `pipeline.py` is imported by `patterns.py` which is imported by `main.py`, a missing Groq key would crash the **entire** FastAPI server on startup — including endpoints that don't use AI at all (`/items`, `/auth`, `/metrics`).
2. The `ChatGroq` LLM was initialized with a redundant `os.environ.get("GROQ_API_KEY", "")` call instead of using the `GROQ_API_KEY` variable already fetched above it.

**Fix:**
1. Replaced the hard `ValueError` with a `warnings.warn()` so the server boots normally and only AI-dependent routes are affected.
2. Changed the `ChatGroq` initialization to use the already-fetched `GROQ_API_KEY` variable (`api_key=GROQ_API_KEY or ""`).

### BUG-014 — Internal assignment briefs tracked in git (Docs Leak)
**Severity:** High (Security)
**Fixed:** 2026-08-23
**Files affected:**
- `02_Developer_A_Backend.docx`
- `03_Developer_B_AIML (1).docx`
- `04_Developer_C_Frontend.docx`

**Problem:**
Internal assignment briefs containing project requirements, grading rubrics, and team structure were potentially exposed to the public. While a `*.docx` rule existed in `.gitignore`, the files were previously committed and tracked.

**Fix:**
Verified that the files are no longer tracked by git (`git ls-files` confirmed they are untracked). The existing `*.docx` rule in `.gitignore` will prevent them from being committed again.

### BUG-015 — Hardcoded JWT fallback secret in source code
**Severity:** High (Security)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/auth_utils.py`
- `backend/.env.example`

**Problem:**
`auth_utils.py` was using a hardcoded fallback `JWT_SECRET_KEY` in the source code if the environment variable wasn't set. Since this source code is committed to git, anyone could potentially use this fallback key to forge valid JWTs in production if the environment variable was missing. Additionally, `JWT_SECRET_KEY` was missing from `.env.example`, so developers might unknowingly rely on the fallback.

**Fix:**
1. Modified `auth_utils.py` to check for `JWT_SECRET_KEY`. If missing, it now generates an ephemeral, cryptographically secure random key (`secrets.token_hex(32)`) and raises a warning. Tokens signed with this key won't persist across server restarts, forcing developers to configure a proper key for production without exposing a static fallback.
2. Added `JWT_SECRET_KEY` with a placeholder to `.env.example`.

### BUG-016 — Hardcoded fallback secrets in docker-compose.yml
**Severity:** High (Security)
**Fixed:** 2026-08-23
**Files affected:**
- `docker-compose.yml`

**Problem:**
`docker-compose.yml` contained hardcoded fallback values for `ADMIN_API_KEY` and `JWT_SECRET_KEY`. Anyone cloning the repository and running `docker-compose up` without setting up a `.env` file would end up running the production-ready docker container with predictable, insecure plaintext secrets.

**Fix:**
Removed the fallback values and replaced them with the `:?` bash parameter expansion (`${ADMIN_API_KEY:?ADMIN_API_KEY is required}`). This ensures that Docker Compose will fail to start and print a clear error message if these critical secrets are missing, rather than silently falling back to insecure defaults.

### BUG-017 — Hardcoded localhost API URL in frontend
**Severity:** High (Bug)
**Fixed:** 2026-08-23
**Files affected:**
- `src/context/GravequitContext.jsx`
- `src/pages/AdvisorDashboardPage.jsx`

**Problem:**
The frontend was using a hardcoded `const API_BASE = 'http://localhost:8000';`. This would cause the frontend to fail in production, as it would always attempt to communicate with localhost instead of the deployed backend server.

**Fix:**
Replaced the hardcoded string with `import.meta.env.VITE_API_BASE || 'http://localhost:8000'`. This allows the Vite build process to inject the correct production backend URL while preserving local development functionality.

### BUG-018 — `ai_summary.py` uses `"fallback_key"` placeholder
**Severity:** Medium (Bug)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/ai_summary.py`

**Problem:**
The Groq client was initialized with a hardcoded `"fallback_key"` if `GROQ_API_KEY` was missing from the environment. This would cause the app to attempt to send an API request to Groq with an invalid key, resulting in a confusing 401 Unauthorized error deep in the stack trace.

**Fix:**
Removed the fallback key. The script now conditionally initializes the `Groq` client only if `GROQ_API_KEY` is present. If the key is missing, `generate_pattern_summary` gracefully returns a human-readable fallback string indicating that AI features are unconfigured, preventing any crashes or API errors.

### BUG-019 — Metrics endpoints fully unauthenticated
**Severity:** Medium (Security)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/routers/metrics.py`
- `src/pages/AdvisorDashboardPage.jsx`
- `src/pages/InternalMetricsPage.jsx`

**Problem:**
The `/metrics/advisor` and `/metrics/internal` endpoints were completely unauthenticated. Anyone who discovered the URLs could scrape aggregate platform statistics, user counts, quit event counts, AI accuracy rates, and recent activity feeds.

**Fix:**
Secured both routes in `metrics.py` by requiring standard JWT authentication (`Depends(get_current_user)`). Updated the `AdvisorDashboardPage` and `InternalMetricsPage` React components to fetch these endpoints using `getAuthHeaders()` from the auth context. While not strict role-based access control, this ensures that only logged-in users can view the data, fulfilling the security requirement without overly complicating the mock dashboard architecture.

### BUG-020 — Any user can trigger mass email digest
**Severity:** Medium (Security)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/auth_utils.py`
- `backend/routers/digest.py`

**Problem:**
The `POST /notifications/weekly-digest/send` endpoint was protected by `get_current_user`, meaning any logged-in student could hit this route to trigger the system-wide generation and queuing of the weekly AI digest emails. This could be abused to spam users, exhaust Groq API limits, and run up backend compute bills.

**Fix:**
Created a reusable `verify_admin_key` dependency in `auth_utils.py` that validates the `X-Admin-Api-Key` header. Swapped out `get_current_user` for `verify_admin_key` on the `/weekly-digest/send` endpoint. Now, only the system administrator (or a cron job with the correct API key) can trigger the mass email dispatch.

### BUG-021 — `load_dotenv()` called redundantly across modules
**Severity:** Low (Performance)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/routers/auth.py`
- `backend/pipeline.py`
- `backend/database.py`
- `backend/auth_utils.py`
- `backend/ai_summary.py`

**Problem:**
Several modules were calling `load_dotenv()` at the module level or inside route handlers (e.g., `/auth/config` was calling `load_dotenv(override=True)` on *every single request*). This caused unnecessary disk I/O and redundant environment parsing.

**Fix:**
Removed all `load_dotenv()` calls from child modules. It is now only called once at the very top of `backend/main.py` when the server starts up, which is the standard FastAPI best practice.

### BUG-022 — Rate limiter memory leak
**Severity:** Low (Performance)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/main.py`

**Problem:**
The in-memory rate limiting dictionary `client_request_history` was tracking request timestamps per IP, but it never deleted the IP keys when users stopped making requests. Over a long uptime, this dictionary would grow indefinitely, slowly leaking memory.

**Fix:**
Added a periodic garbage collection block to the rate-limiter middleware. Every 5 minutes, it scans the dictionary and completely deletes keys for IP addresses that haven't made a request in the last 60 seconds.

### BUG-023 — N+1 API calls for risk scores on page load
**Severity:** Low (Performance)
**Fixed:** 2026-08-23
**Files affected:**
- `backend/schemas.py`
- `backend/routers/items.py`
- `src/context/GravequitContext.jsx`

**Problem:**
The frontend context `fetchItems()` function was looping over every item returned by `GET /items` and, for each active item, firing a separate `fetch` to `GET /items/{id}/risk` to get the risk score. For a user with 50 active items, this would fire 51 HTTP requests in parallel on page load, choking the browser network queue and hammering the backend.

**Fix:**
Calculated the risk score in bulk directly inside the `GET /items` backend endpoint and appended `risk_percentage` and `driving_factor` to the `ItemResponse` schema. Updated `GravequitContext.jsx` to map these directly from the initial items payload, entirely eliminating the N+1 API calls.

---

## Open Bugs

See the active items in code_review.md and code_audit_round2.md (artifacts directory).
