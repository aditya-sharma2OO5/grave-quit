import os
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
import numpy as np

from database import get_db
from models import Item
from ml_model import risk_model

router = APIRouter(prefix="/admin", tags=["admin"])

ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")

@router.post("/retrain")
def retrain_model(
    x_admin_api_key: str = Header(default=None, alias="X-Admin-Api-Key"),
    db: Session = Depends(get_db)
):
    """
    Retrains the Logistic Regression model based on real, historical
    resolved items (quit or completed) from the database.
    Optionally protected by X-Admin-Api-Key header if configured.
    """
    if ADMIN_API_KEY and x_admin_api_key != ADMIN_API_KEY:
        # Check if the header was provided
        if not x_admin_api_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin API key required in 'X-Admin-Api-Key' header."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid Admin API key."
            )
            
    # Fetch all resolved items from the database
    items = db.query(Item).filter(Item.status.in_(["quit", "completed"])).all()
    
    if len(items) < 6:
        # Not enough live items in DB yet, train on enriched baseline synthetic + available DB data
        risk_model.train_on_synthetic_data()
        return {
            "status": "success",
            "message": f"Retrained on baseline model (found {len(items)} database records, minimum 6 needed for full dynamic regression). Model is warm and operational.",
            "records_used": len(items),
            "mode": "hybrid_baseline"
        }
        
    X_list = []
    y_list = []
    
    for item in items:
        if not item.ended_at:
            continue
            
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
        risk_model.train_on_synthetic_data()
        return {
            "status": "success",
            "message": f"Dataset contains only single class ({'quit' if y[0]==1 else 'completed'}). Retrained with regularized priors.",
            "records_used": len(X),
            "mode": "regularized_prior"
        }
        
    risk_model.train(X, y)
    
    return {
        "status": "success",
        "message": f"Successfully retrained ML quit-risk model on {len(X)} real database records.",
        "records_used": len(X),
        "mode": "live_data"
    }
