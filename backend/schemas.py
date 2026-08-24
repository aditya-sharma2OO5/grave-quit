from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# ─── Auth Schemas ────────────────────────────────────────────────
class UserSignup(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str

class UserResponse(BaseModel):
    id: int
    email: str
    email_opt_in: bool
    reminder_opt_in: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserSettingsUpdate(BaseModel):
    email_opt_in: Optional[bool] = None
    reminder_opt_in: Optional[bool] = None

# ─── Pattern Summary Schemas ─────────────────────────────────────
class PatternStats(BaseModel):
    avg_days_to_quit: Optional[float]
    most_common_tag: Optional[str]
    total_quit: int
    total_completed: int

class PatternSummaryResponse(BaseModel):
    id: Optional[int] = None
    stats: PatternStats
    ai_summary: str
    clusters: Optional[dict] = None
    similar_entries: Optional[list] = None
    risk_explanation: Optional[str] = None
    generated_at: datetime

class FeedbackCreate(BaseModel):
    summary_id: Optional[int] = None
    rating: int  # 1 for thumbs up, -1 for thumbs down
    feedback_text: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    user_id: Optional[int]
    rating: int
    message: str

# ─── Item CRUD Schemas ───────────────────────────────────────────
class QuitReasonDetail(BaseModel):
    reason_tag: str
    reason_text: Optional[str] = None
    voice_transcript: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ItemCreate(BaseModel):
    title: str
    category: str = "Skill"
    note: Optional[str] = None

class ItemResponse(BaseModel):
    id: int
    title: str
    category: str
    status: str
    note: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    quit_reason: Optional[QuitReasonDetail] = None
    risk_percentage: Optional[float] = None
    driving_factor: Optional[str] = None

    class Config:
        from_attributes = True

class QuitRequest(BaseModel):
    reason_tag: str
    reason_text: Optional[str] = None
    voice_transcript: Optional[str] = None
    ended_at: Optional[datetime] = None

class QuitResponse(BaseModel):
    id: int
    status: str
    ended_at: datetime
    reason_tag: str
    reason_text: Optional[str] = None
