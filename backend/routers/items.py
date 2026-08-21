from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import Item
from ml_model import risk_model

router = APIRouter()

# Mock user for now
class MockUser:
    id = 1

def get_current_user():
    return MockUser()

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
    days_active = (datetime.utcnow() - item.started_at).days
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
