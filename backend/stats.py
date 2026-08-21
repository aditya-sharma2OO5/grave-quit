from collections import Counter
from statistics import mean
from datetime import datetime
from typing import List, Dict, Any, Optional

def compute_stats(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes deterministic stats from a list of item dictionaries.
    items: list of dicts like:
      {
        "status": "quit", 
        "started_at": datetime, 
        "ended_at": datetime,
        "reason_tag": "Too Busy"
      }
    Pure function. No I/O, no LLM calls.
    """
    quit_items = [i for i in items if i.get("status") == "quit"]
    completed = [i for i in items if i.get("status") == "completed"]
 
    if not quit_items:
        return {
            "avg_days_to_quit": None, 
            "most_common_tag": None,
            "total_quit": 0, 
            "total_completed": len(completed)
        }
 
    durations = []
    for i in quit_items:
        if i.get("started_at") and i.get("ended_at"):
            duration = (i["ended_at"] - i["started_at"]).days
            # Optional: handle partial days by using seconds / 86400
            durations.append(max(0, duration))
            
    tags = [i["reason_tag"] for i in quit_items if i.get("reason_tag")]
    most_common = Counter(tags).most_common(1)[0][0] if tags else None
    
    avg_days = round(mean(durations), 1) if durations else None

    return {
        "avg_days_to_quit": avg_days,
        "most_common_tag": most_common,
        "total_quit": len(quit_items),
        "total_completed": len(completed),
    }
