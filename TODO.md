# Gravequit — Developer TODOs

---

## Backend (Dev A) — COMPLETED ✅

### [x] Replace MockAuth with Real JWT Authentication
**Context:** Implemented stateless JWT Bearer token authentication in `backend/auth.py` and `backend/routers/auth.py` with password hashing (`backend/auth_utils.py`).
**Endpoints:** `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`, `PATCH /auth/settings`, `DELETE /auth/account`.

### [x] Per-User Data Isolation
**Context:** All database models and endpoints (`/items`, `/patterns/summary`, `/notifications/weekly-digest`) are strictly scoped by `user_id`.

### [x] Core Items CRUD & Deletion
**Context:** `GET /items`, `POST /items`, `PATCH /items/{id}/quit`, `DELETE /items/{id}` fully operational with attached quit reasons.

### [x] Weekly Digest Email Service
**Context:** `GET /notifications/weekly-digest/preview` and `POST /notifications/weekly-digest/send` built to format gentle, empathetic weekly summaries for opted-in students.

### [x] Rate-Limiting & Production Deployment
**Context:** Added rate-limiting middleware, Dockerfile, docker-compose.yml, render.yaml, and railway.json.

---

## Frontend (Dev C) — COMPLETED ✅

### [x] Wire Login & Signup UI to Real Auth
**Context:** `LoginPage.jsx` wired to live backend auth endpoints, storing JWT tokens in localStorage and managing user session state in `GravequitContext.jsx`.

### [x] Render LangGraph Pipeline Data in Pattern Dashboard
**Context:** Updated `PatternDashboardPage.jsx` to render semantic clusters, risk explanation ("Why this prediction"), and similar past entries.

### [x] Thumbs Up / Down AI Summary Feedback
**Context:** Added interactive feedback widget on `PatternDashboardPage.jsx` sending ratings to `POST /patterns/feedback` and updating `AIFeedback` table.

### [x] Build "Retrain AI Model" Button on Internal Dashboard
**Context:** Added "Retrain AI Model" action button on `InternalMetricsPage.jsx` wired to `/admin/retrain` with live status feedback.

---

## AI/ML (Dev B) — COMPLETED ✅

### [x] Secure the `/admin/retrain` Endpoint
**Context:** Protected `/admin/retrain` with `X-Admin-Api-Key` header verification and regularized fallback training on live database items.

### [x] Weekly Digest & Multi-Agent LangGraph Pipeline
**Context:** LangGraph multi-agent pipeline (Extractor -> Pattern -> Narrator -> Why-Prediction) with 100% fact-check grounding.
