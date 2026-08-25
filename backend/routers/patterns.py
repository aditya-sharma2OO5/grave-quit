from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models import Item, PatternSummary, AIFeedback, User
from schemas import PatternSummaryResponse, PatternStats, FeedbackCreate, FeedbackResponse
from stats import compute_stats
from ai_summary import generate_pattern_summary
from pipeline import run_pipeline
from auth import get_current_user

router = APIRouter(prefix="/patterns", tags=["patterns"])

@router.get("/summary", response_model=PatternSummaryResponse)
def get_pattern_summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
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

    # Check for a valid cached summary for this user
    cached_summary = db.query(PatternSummary).filter(
        PatternSummary.user_id == user.id,
        PatternSummary.total_quit_at_generation == current_total_quit
    ).order_by(PatternSummary.generated_at.desc()).first()

    if cached_summary:
        return {
            "id": cached_summary.id,
            "stats": stats,
            "ai_summary": cached_summary.ai_summary_text,
            "clusters": cached_summary.clusters,
            "similar_entries": cached_summary.similar_entries,
            "risk_explanation": cached_summary.risk_explanation,
            "generated_at": cached_summary.generated_at
        }

    # If no quit items yet, provide a gentle initial message
    if current_total_quit == 0:
        return {
            "id": None,
            "stats": stats,
            "ai_summary": "You haven't paused or let go of any items yet. As you observe your journeys, gentle pattern insights will form here.",
            "clusters": {},
            "similar_entries": [],
            "risk_explanation": "No drop-off history recorded yet.",
            "generated_at": datetime.now(timezone.utc)
        }

    # Security #10: Per-user AI generation cooldown (5 minutes)
    # Prevents a single user from spamming the LLM API via rapid dashboard refreshes
    AI_COOLDOWN_SECONDS = 300
    latest_summary = db.query(PatternSummary).filter(
        PatternSummary.user_id == user.id
    ).order_by(PatternSummary.generated_at.desc()).first()

    if latest_summary:
        elapsed = (datetime.now(timezone.utc) - latest_summary.generated_at.replace(tzinfo=timezone.utc)).total_seconds()
        if elapsed < AI_COOLDOWN_SECONDS:
            # Return the most recent summary instead of generating a new one
            return {
                "id": latest_summary.id,
                "stats": stats,
                "ai_summary": latest_summary.ai_summary_text,
                "clusters": latest_summary.clusters,
                "similar_entries": latest_summary.similar_entries,
                "risk_explanation": latest_summary.risk_explanation,
                "generated_at": latest_summary.generated_at
            }

    # Generate new summary if cache is invalid or missing
    all_reasons = [i.reason.reason_text for i in items if i.reason and i.reason.reason_text]
    latest_reason = all_reasons[-1] if all_reasons else ""
    
    try:
        pipeline_result = run_pipeline(item_dicts, all_reasons, latest_reason)
        summary_text = pipeline_result.get("ai_summary", "Not enough data for summary.")
        clusters = pipeline_result.get("clusters")
        similar_entries = pipeline_result.get("similar_entries")
        risk_explanation = pipeline_result.get("risk_explanation")
    except Exception as e:
        # Fallback to the lightweight ai_summary script if pipeline fails
        recent_reasons = all_reasons[-5:]
        summary_text = generate_pattern_summary(stats, recent_reasons)
        clusters = None
        similar_entries = None
        risk_explanation = None
    
    new_summary = PatternSummary(
        user_id=user.id,
        computed_stats=stats,
        ai_summary_text=summary_text,
        total_quit_at_generation=current_total_quit,
        clusters=clusters,
        similar_entries=similar_entries,
        risk_explanation=risk_explanation,
        generated_at=datetime.now(timezone.utc)
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)
    
    return {
        "id": new_summary.id,
        "stats": stats, 
        "ai_summary": summary_text,
        "clusters": clusters,
        "similar_entries": similar_entries,
        "risk_explanation": risk_explanation,
        "generated_at": new_summary.generated_at
    }

@router.post("/feedback", response_model=FeedbackResponse)
def submit_ai_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Save Thumbs Up (+1) or Thumbs Down (-1) feedback to the database."""
    if feedback_in.rating not in [1, -1]:
        raise HTTPException(status_code=400, detail="Rating must be 1 (thumbs up) or -1 (thumbs down).")
        
    feedback = AIFeedback(
        user_id=user.id,
        summary_id=feedback_in.summary_id,
        rating=feedback_in.rating,
        feedback_text=feedback_in.feedback_text,
        created_at=datetime.now(timezone.utc)
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    return {
        "id": feedback.id,
        "user_id": feedback.user_id,
        "rating": feedback.rating,
        "message": "Thank you for your feedback! It helps refine our grounding and narration."
    }
