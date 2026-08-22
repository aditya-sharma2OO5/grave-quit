from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import Item, PatternSummary
from schemas import PatternSummaryResponse, PatternStats
from stats import compute_stats
from ai_summary import generate_pattern_summary
from pipeline import run_pipeline
from auth import get_current_user

router = APIRouter()



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
    current_total_quit = stats.get("total_quit", 0)

    # Check for a valid cached summary
    cached_summary = db.query(PatternSummary).filter(
        PatternSummary.user_id == user.id,
        PatternSummary.total_quit_at_generation == current_total_quit
    ).order_by(PatternSummary.generated_at.desc()).first()

    if cached_summary:
        return {
            "stats": stats,
            "ai_summary": cached_summary.ai_summary_text,
            "generated_at": cached_summary.generated_at
        }

    # Generate new summary if cache is invalid or missing
    # We pass all reasons to the pipeline for clustering/RAG
    all_reasons = [i.reason.reason_text for i in items if i.reason and i.reason.reason_text]
    latest_reason = all_reasons[-1] if all_reasons else ""
    
    try:
        pipeline_result = run_pipeline(item_dicts, all_reasons, latest_reason)
        summary_text = pipeline_result.get("ai_summary", "Not enough data for summary.")
    except Exception as e:
        # Fallback to the lightweight ai_summary script if pipeline fails
        recent_reasons = all_reasons[-5:]
        summary_text = generate_pattern_summary(stats, recent_reasons)
    
    new_summary = PatternSummary(
        user_id=user.id,
        computed_stats=stats,
        ai_summary_text=summary_text,
        total_quit_at_generation=current_total_quit,
        generated_at=datetime.now(datetime.UTC)
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)
    
    return {
        "stats": stats, 
        "ai_summary": summary_text,
        "generated_at": new_summary.generated_at
    }
