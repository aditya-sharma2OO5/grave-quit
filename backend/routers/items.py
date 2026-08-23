from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import List, Optional

from auth import get_current_user
from database import get_db
from models import Item, QuitReason, User, PatternSummary
from ml_model import risk_model
from schemas import ItemCreate, ItemResponse, QuitRequest, QuitResponse

router = APIRouter()

# Valid 5 tags in Gravequit
VALID_TAGS = {
    "too_busy": "Too Busy",
    "too_hard": "Too Hard",
    "lost_interest": "Lost Interest",
    "no_deadline": "No Deadline",
    "other": "Other",
    "too busy": "Too Busy",
    "too hard": "Too Hard",
    "lost interest": "Lost Interest",
    "no deadline": "No Deadline",
}

def normalize_tag(tag_input: str) -> str:
    cleaned = tag_input.strip().lower()
    return VALID_TAGS.get(cleaned, "Other")

@router.get("/items", response_model=List[ItemResponse])
def get_items(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Returns the authenticated user's full item list (active + past)."""
    items = (
        db.query(Item)
        .options(joinedload(Item.reason))
        .filter(Item.user_id == user.id)
        .order_by(Item.started_at.desc())
        .all()
    )
    
    user_total_quit = sum(1 for i in items if i.status == "quit")
    user_total_completed = sum(1 for i in items if i.status == "completed")
    
    response = []
    for item in items:
        quit_reason_data = None
        if item.reason:
            quit_reason_data = {
                "reason_tag": item.reason.reason_tag,
                "reason_text": item.reason.reason_text,
                "voice_transcript": item.reason.voice_transcript,
                "created_at": item.reason.created_at
            }
            
        risk_pct = None
        driving_factor = None
        if item.status == "active":
            started_at_naive = item.started_at.replace(tzinfo=None) if item.started_at.tzinfo else item.started_at
            days_active = max(0, (datetime.now(timezone.utc).replace(tzinfo=None) - started_at_naive).days)
            risk_pct = risk_model.predict_risk(days_active, user_total_quit, user_total_completed)
            
            driving_factor = "Recent drop-offs in your history"
            if user_total_quit == 0:
                driving_factor = "Item is new and you have a steady foundation"
            elif days_active > 14 and user_total_quit > 0:
                driving_factor = "Time elapsed matches your typical stall window"
            elif days_active <= 7:
                driving_factor = "Early commitment phase — initial momentum building"

        response.append({
            "id": item.id,
            "title": item.title,
            "category": item.category or "Other",
            "status": item.status,
            "note": item.note,
            "started_at": item.started_at,
            "ended_at": item.ended_at,
            "quit_reason": quit_reason_data,
            "risk_percentage": risk_pct,
            "driving_factor": driving_factor
        })
    return response

@router.post("/items", response_model=ItemResponse)
def create_item(
    item_in: ItemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Creates a new tracked item for the authenticated user."""
    new_item = Item(
        user_id=user.id,
        title=item_in.title.strip(),
        category=item_in.category or "Skill",
        note=item_in.note.strip() if item_in.note else None,
        status="active",
        started_at=datetime.now(timezone.utc)
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {
        "id": new_item.id,
        "title": new_item.title,
        "category": new_item.category,
        "status": new_item.status,
        "note": new_item.note,
        "started_at": new_item.started_at,
        "ended_at": new_item.ended_at,
        "quit_reason": None
    }

def handle_quit(item_id: int, quit_in: QuitRequest, db: Session, user: User):
    item = db.query(Item).filter(Item.id == item_id, Item.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.status != "active":
        raise HTTPException(status_code=400, detail="Only active items can be quit")

    now = datetime.now(timezone.utc)
    item.status = "quit"
    item.ended_at = now

    norm_tag = normalize_tag(quit_in.reason_tag)

    reason = QuitReason(
        item_id=item.id,
        reason_tag=norm_tag,
        reason_text=quit_in.reason_text.strip() if quit_in.reason_text else None,
        voice_transcript=quit_in.voice_transcript.strip() if quit_in.voice_transcript else None,
        created_at=now
    )
    db.add(reason)
    db.commit()
    db.refresh(item)
    
    return {
        "id": item.id,
        "status": item.status,
        "ended_at": item.ended_at,
        "reason_tag": norm_tag,
        "reason_text": reason.reason_text
    }

@router.patch("/items/{item_id}/quit", response_model=QuitResponse)
def quit_item_patch(
    item_id: int,
    quit_in: QuitRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Mark an item as quit via PATCH (10-second reason capture flow)."""
    return handle_quit(item_id, quit_in, db, user)

@router.post("/items/{item_id}/quit", response_model=QuitResponse)
def quit_item_post(
    item_id: int,
    quit_in: QuitRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Mark an item as quit via POST (compatible with both REST patterns)."""
    return handle_quit(item_id, quit_in, db, user)

@router.delete("/items/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Delete an item owned by the authenticated user."""
    item = db.query(Item).filter(Item.id == item_id, Item.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(item)
    db.commit()
    return {"message": f"Item {item_id} deleted successfully."}

class RiskResponse(BaseModel):
    item_id: int
    risk_percentage: float
    driving_factor: str

@router.get("/items/{item_id}/risk", response_model=RiskResponse)
def get_item_risk(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(Item.id == item_id, Item.user_id == user.id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.status != "active":
        raise HTTPException(status_code=400, detail="Risk can only be calculated for active items")

    # Calculate days active
    started_at_naive = item.started_at.replace(tzinfo=None) if item.started_at.tzinfo else item.started_at
    days_active = (datetime.now(timezone.utc).replace(tzinfo=None) - started_at_naive).days
    days_active = max(0, days_active)

    # Get user's history
    user_items = db.query(Item).filter(Item.user_id == user.id).all()
    user_total_quit = sum(1 for i in user_items if i.status == "quit")
    user_total_completed = sum(1 for i in user_items if i.status == "completed")
    
    # Predict risk
    risk_pct = risk_model.predict_risk(days_active, user_total_quit, user_total_completed)
    
    # Driving factor (Feature 13 - "Why this prediction")
    driving_factor = "Recent drop-offs in your history"
    if user_total_quit == 0:
        driving_factor = "Item is new and you have a steady foundation"
    elif days_active > 14 and user_total_quit > 0:
        driving_factor = "Time elapsed matches your typical stall window"
    elif days_active <= 7:
        driving_factor = "Early commitment phase — initial momentum building"
        
    return {
        "item_id": item_id,
        "risk_percentage": risk_pct,
        "driving_factor": driving_factor
    }
