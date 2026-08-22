from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import numpy as np

from database import get_db
from models import Item
from ml_model import risk_model

router = APIRouter()

@router.post("/admin/retrain")
def retrain_model(db: Session = Depends(get_db)):
    """
    Retrains the Logistic Regression model based on real, historical
    resolved items (quit or completed) from the database.
    """
    # Fetch all resolved items
    items = db.query(Item).filter(Item.status.in_(["quit", "completed"])).all()
    
    if len(items) < 10:
        raise HTTPException(status_code=400, detail=f"Not enough data to train. Found {len(items)} items, need at least 10.")
        
    X_list = []
    y_list = []
    
    for item in items:
        if not item.ended_at:
            continue
            
        # Calculate days active
        started = item.started_at.replace(tzinfo=None) if item.started_at.tzinfo else item.started_at
        ended = item.ended_at.replace(tzinfo=None) if item.ended_at.tzinfo else item.ended_at
        days_active = max(1, (ended - started).days)
        
        # Prevent data leakage: only look at past items that ended BEFORE this item started
        past_items = db.query(Item).filter(
            Item.user_id == item.user_id,
            Item.ended_at != None,
            Item.ended_at < item.started_at
        ).all()
        
        user_total_quit = sum(1 for i in past_items if i.status == "quit")
        user_total_completed = sum(1 for i in past_items if i.status == "completed")
        
        target = 1 if item.status == "quit" else 0
        
        X_list.append([days_active, user_total_quit, user_total_completed])
        y_list.append(target)
        
    X = np.array(X_list)
    y = np.array(y_list)
    
    if len(np.unique(y)) < 2:
        raise HTTPException(status_code=400, detail="Cannot train: dataset must contain both 'quit' and 'completed' examples.")
        
    risk_model.train(X, y)
    
    return {"message": f"Successfully retrained ML model on {len(X)} real database records."}
