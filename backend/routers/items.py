from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from auth import get_current_user

from database import get_db
from models import Item, QuitReason
from ml_model import risk_model
from schemas import ItemCreate, ItemResponse, QuitRequest, QuitResponse

router = APIRouter()

@router.get("/items", response_model=list[ItemResponse])
def get_items(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return db.query(Item).filter(Item.user_id == user.id).all()

@router.post("/items", response_model=ItemResponse)
def create_item(item_in: ItemCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    new_item = Item(
        user_id=user.id,
        title=item_in.title,
        category=item_in.category,
        status="active",
        started_at=datetime.now(datetime.UTC)
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.patch("/items/{item_id}/quit", response_model=QuitResponse)
def quit_item(item_id: int, quit_in: QuitRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id, Item.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.status != "active":
        raise HTTPException(status_code=400, detail="Only active items can be quit")

    now = datetime.now(datetime.UTC)
    item.status = "quit"
    item.ended_at = now

    reason = QuitReason(
        item_id=item.id,
        reason_tag=quit_in.reason_tag,
        reason_text=quit_in.reason_text,
        voice_transcript=quit_in.voice_transcript,
        created_at=now
    )
    db.add(reason)
    db.commit()
    db.refresh(item)
    
    return {
        "id": item.id,
        "status": item.status,
        "ended_at": item.ended_at
    }

class RiskResponse(BaseModel):
    item_id: int
    risk_percentage: float
    driving_factor: str

@router.get("/items/{item_id}/risk", response_model=RiskResponse)
def get_item_risk(item_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id, Item.user_id == user.id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.status != "active":
        raise HTTPException(status_code=400, detail="Risk can only be calculated for active items")

    # Calculate days active
    started_at_naive = item.started_at.replace(tzinfo=None) if item.started_at.tzinfo else item.started_at
    days_active = (datetime.utcnow() - started_at_naive).days
    days_active = max(0, days_active)

    # Get user's history
    user_items = db.query(Item).filter(Item.user_id == user.id).all()
    user_total_quit = sum(1 for i in user_items if i.status == "quit")
    user_total_completed = sum(1 for i in user_items if i.status == "completed")
    
    # Predict risk
    risk_pct = risk_model.predict_risk(days_active, user_total_quit, user_total_completed)
    
    # Simple heuristic for driving factor (Feature 13 - "Why this prediction")
    driving_factor = "Recent drop-offs in your history"
    if user_total_quit == 0:
        driving_factor = "Item is new and you have a solid completion rate"
    elif days_active > 14 and user_total_quit > 0:
        driving_factor = "Time elapsed matches your typical stall window"
        
    return {
        "item_id": item_id,
        "risk_percentage": risk_pct,
        "driving_factor": driving_factor
    }
