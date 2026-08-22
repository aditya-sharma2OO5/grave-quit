from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PatternStats(BaseModel):
    avg_days_to_quit: Optional[float]
    most_common_tag: Optional[str]
    total_quit: int
    total_completed: int

class PatternSummaryResponse(BaseModel):
    stats: PatternStats
    ai_summary: str
    clusters: Optional[dict] = None
    similar_entries: Optional[list] = None
    risk_explanation: Optional[str] = None
    generated_at: datetime

# Item CRUD Schemas
class ItemCreate(BaseModel):
    title: str
    category: str = "Other"

class ItemResponse(BaseModel):
    id: int
    title: str
    category: str
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None

class QuitRequest(BaseModel):
    reason_tag: str
    reason_text: Optional[str] = None
    voice_transcript: Optional[str] = None

class QuitResponse(BaseModel):
    id: int
    status: str
    ended_at: datetime
