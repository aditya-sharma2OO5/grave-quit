import os
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User
from auth_utils import hash_password, verify_password, create_access_token
from auth import get_current_user
from schemas import UserSignup, UserLogin, GoogleLoginRequest, AuthResponse, UserResponse, UserSettingsUpdate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/config")
def get_auth_config():
    """Return public auth config like Google Client ID to frontend."""
    client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip("'\" ")
    return {
        "google_client_id": client_id
    }

@router.post("/google", response_model=AuthResponse)
def google_auth(google_req: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Validates Google ID token via Google's tokeninfo endpoint,
    creates or logs in the user, and returns Gravequit JWT.
    """
    credential = google_req.credential.strip()
    if not credential:
        raise HTTPException(status_code=400, detail="Google credential token is required.")

    # Verify ID Token using Google tokeninfo API
    try:
        resp = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}",
            timeout=10
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token.")
        google_data = resp.json()
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Failed to communicate with Google authentication servers.")

    email = google_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no associated email.")

    email_clean = email.strip().lower()

    # Optional audience check if GOOGLE_CLIENT_ID is configured
    expected_client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip("'\" ")
    if expected_client_id and google_data.get("aud") != expected_client_id:
        # Check if audience is in aud list or matches
        aud = google_data.get("aud")
        if aud and expected_client_id not in aud:
            raise HTTPException(status_code=401, detail="Token audience mismatch.")

    # Find or create user
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        user = User(
            email=email_clean,
            hashed_password=None,
            email_opt_in=True,
            reminder_opt_in=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/signup", response_model=AuthResponse)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    email_clean = user_data.email.strip().lower()
    if not email_clean or "@" not in email_clean:
        raise HTTPException(status_code=400, detail="Invalid email address format.")
    
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
        
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
        
    hashed = hash_password(user_data.password)
    new_user = User(
        email=email_clean,
        hashed_password=hashed,
        email_opt_in=True,
        reminder_opt_in=False,
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    email_clean = user_data.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
        
    # If user was created prior without password (legacy mock user), set their password on first login
    if not user.hashed_password:
        user.hashed_password = hash_password(user_data.password)
        db.commit()
        db.refresh(user)
    elif not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
        
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/settings", response_model=UserResponse)
def update_settings(
    settings_in: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if settings_in.email_opt_in is not None:
        current_user.email_opt_in = settings_in.email_opt_in
    if settings_in.reminder_opt_in is not None:
        current_user.reminder_opt_in = settings_in.reminder_opt_in
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Permanently delete student account and cascade-delete all data."""
    db.delete(current_user)
    db.commit()
    return {"message": "Account and all associated reflections permanently deleted."}
