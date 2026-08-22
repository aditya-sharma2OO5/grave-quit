from datetime import datetime, timedelta, timezone
from stats import compute_stats

def test_compute_stats():
    now = datetime.now(timezone.utc)
    items = [
        {
            "status": "quit", 
            "started_at": now - timedelta(days=10),
            "ended_at": now - timedelta(days=1), 
            "reason_tag": "Too Busy"
        },
        {
            "status": "quit", 
            "started_at": now - timedelta(days=20),
            "ended_at": now - timedelta(days=12), 
            "reason_tag": "Too Busy"
        },
        {
            "status": "quit", 
            "started_at": now - timedelta(days=15),
            "ended_at": now - timedelta(days=5), 
            "reason_tag": "Lost Interest"
        },
        {
            "status": "completed", 
            "started_at": now - timedelta(days=30),
            "ended_at": now - timedelta(days=5), 
            "reason_tag": None
        },
    ]
    
    result = compute_stats(items)
    
    assert result["total_quit"] == 3
    assert result["total_completed"] == 1
    assert result["most_common_tag"] == "Too Busy"
    # Durations: 9 days, 8 days, 10 days => avg 9.0
    assert result["avg_days_to_quit"] == 9.0

    print("PASS: test_compute_stats")

if __name__ == "__main__":
    test_compute_stats()
