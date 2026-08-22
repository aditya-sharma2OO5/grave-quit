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

*(No pending actions yet)*

---

## AI/ML (Dev B)

*(No pending actions yet)*
