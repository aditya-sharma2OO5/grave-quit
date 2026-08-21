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
    generated_at: datetime
