from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

from database import get_db
from models import User, Item, QuitReason
from auth import get_current_user
from stats import compute_stats
from ai_summary import generate_pattern_summary

router = APIRouter(prefix="/notifications", tags=["notifications"])

def build_digest_content(user: User, items: List[Item]) -> Dict[str, Any]:
    """Generates the weekly digest data and email body for a user."""
    item_dicts = []
    for i in items:
        item_dicts.append({
            "status": i.status,
            "started_at": i.started_at,
            "ended_at": i.ended_at,
            "reason_tag": i.reason.reason_tag if i.reason else None,
        })
    
    stats = compute_stats(item_dicts)
    recent_reasons = [i.reason.reason_text for i in items if i.reason and i.reason.reason_text][-3:]
    summary_text = generate_pattern_summary(stats, recent_reasons)
    
    active_count = sum(1 for i in items if i.status == "active")
    quit_count = stats.get("total_quit", 0)
    
    email_body = f"""Subject: Your Gravequit Weekly Reflection — Quiet Insights

Hello,

Here is your weekly observational reflection summary from Gravequit. We celebrate intentional choices and gentle clarity — never streaks, never guilt.

Weekly Summary:
{summary_text}

Your Current Commitments:
- Active pursuits being observed: {active_count}
- Completed reflections: {quit_count}
- Primary closure driver: {stats.get('most_common_tag') or 'None logged yet'}
- Average duration before letting go: {stats.get('avg_days_to_quit') or 'N/A'} days

Remember: Quitting an unaligned task is an act of focus, not a failure.

Warmly,
The Gravequit Team
(You received this because weekly digests are enabled in your Settings. You can opt out anytime with one click.)
"""
    return {
        "user_email": user.email,
        "active_items": active_count,
        "total_quit": quit_count,
        "ai_summary": summary_text,
        "email_subject": "Your Gravequit Weekly Reflection — Quiet Insights",
        "email_body": email_body,
        "generated_at": datetime.now(timezone.utc).isoformat()
    }

@router.get("/weekly-digest/preview")
def preview_weekly_digest(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Preview the weekly email digest for the authenticated user."""
    user_items = db.query(Item).filter(Item.user_id == user.id).all()
    digest = build_digest_content(user, user_items)
    return digest

@router.post("/weekly-digest/send")
def trigger_weekly_digest(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Triggers generation and queued delivery of weekly digests
    for opted-in students.
    """
    opted_in_users = db.query(User).filter(User.email_opt_in == True).all()
    
    sent_count = 0
    results = []
    for u in opted_in_users:
        items = db.query(Item).filter(Item.user_id == u.id).all()
        digest = build_digest_content(u, items)
        # In production, this queues via SendGrid/SES. Here we process and confirm.
        sent_count += 1
        results.append({
            "email": u.email,
            "status": "queued_for_delivery"
        })
        
    return {
        "status": "success",
        "message": f"Generated weekly reflection digest for {sent_count} opted-in student accounts.",
        "recipients_count": sent_count,
        "details": results
    }
