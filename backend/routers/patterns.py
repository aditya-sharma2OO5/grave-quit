from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Item
from schemas import PatternSummaryResponse, PatternStats
from stats import compute_stats
from ai_summary import generate_pattern_summary

router = APIRouter()

# Mocking the dependency to get a user without building full auth
class MockUser:
    id = 1

def get_current_user():
    return MockUser()

@router.get("/patterns/summary", response_model=PatternSummaryResponse)
def get_pattern_summary(db: Session = Depends(get_db), user = Depends(get_current_user)):
    items = db.query(Item).filter(Item.user_id == user.id).all()
    
    item_dicts = []
    for i in items:
        item_dicts.append({
            "status": i.status,
            "started_at": i.started_at,
            "ended_at": i.ended_at,
            "reason_tag": i.reason.reason_tag if i.reason else None,
        })
 
    stats = compute_stats(item_dicts)
    recent_reasons = [i.reason.reason_text for i in items if i.reason and i.reason.reason_text][-5:]
 
    # Generates summary via AI. (Normally would cache this in a pattern_summaries table)
    summary = generate_pattern_summary(stats, recent_reasons)
    
    return {
        "stats": stats, 
        "ai_summary": summary,
        "generated_at": datetime.utcnow()
    }
