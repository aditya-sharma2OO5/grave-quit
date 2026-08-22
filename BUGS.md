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

## Open Bugs

See the active items in code_review.md (artifacts directory).
