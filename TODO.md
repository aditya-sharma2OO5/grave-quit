# Gravequit — Developer TODOs
> **IMPORTANT SECURITY NOTE:** This file (and `BUGS.md`) are currently tracked by git so the team can see them. 
> **WHEN MAKING THIS REPOSITORY PUBLIC**, you must re-add `BUGS.md` and `TODO.md` to `.gitignore` and delete them from the git history so internal notes are not exposed to the public.

---

## Backend (Dev A)

### [ ] Replace MockAuth with Supabase JWT Validation
**Context:** During the initial build, a `MockUser` was used across routers to simulate an authenticated user without blocking development.
**Action Required:** Before production, update `backend/auth.py` to use real JWT validation via Supabase Auth.
**Reference Code (`auth.py`):**
```python
# Replace get_current_user() with:
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SUPABASE_JWT_SECRET, ...)
    return db.query(User).filter(User.id == payload["sub"]).first()
```

---

## Frontend (Dev C)

### [ ] Render LangGraph pipeline data in Pattern Dashboard
**Context:** The `/patterns/summary` endpoint was upgraded (Bug #4) to return the full AI pipeline data instead of just the summary paragraph.
**Action Required:** Update the frontend data models and UI to handle and display:
- `clusters` (JSON dict of categorized reasons)
- `risk_explanation` (The "Why this prediction" string)
- `similar_entries` (Array of past reasons)
See the updated `api_contract.md` for the exact response structure.

### [ ] Hook up Items API (CRUD & Quit Flow)
**Context:** The missing CRUD endpoints for items (Bugs #5 and #6) have been implemented.
**Action Required:** Ensure the frontend calls these routes correctly:
- `GET /items` to load the user's dashboard.
- `POST /items` when adding a new tracked item.
- `PATCH /items/{id}/quit` for the 10-second reason capture flow. (Note: Only `too_busy`, `too_hard`, `lost_interest`, `no_deadline`, `other` are valid `reason_tag`s).

---

## AI/ML (Dev B)

*(No pending actions yet)*
