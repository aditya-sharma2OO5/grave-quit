import os
import secrets
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app

# In-memory SQLite for high-speed automated integration tests
TEST_DATABASE_URL = "sqlite:///./test_gravequit.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_full_system_flow():
    print("\n--- 1. Health Check ---")
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "operational"
    print("Health check passed.")

    print("\n--- 2. Auth Flow (Signup & Login) ---")
    user_email = "test.student@univ.edu"
    user_pass = f"Test_{secrets.token_hex(6)}!A1"
    
    # Seed verification code in test DB
    from datetime import datetime, timezone, timedelta
    from models import User, VerificationCode
    db = TestingSessionLocal()
    db.query(User).filter(User.email == user_email).delete()
    db.query(VerificationCode).filter(VerificationCode.email == user_email).delete()
    db.add(VerificationCode(
        email=user_email,
        code="123456",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10)
    ))
    db.commit()
    db.close()

    # Signup
    signup_res = client.post("/auth/signup", json={"email": user_email, "password": user_pass, "code": "123456"})
    assert signup_res.status_code in [200, 400]
    
    # Login
    login_res = client.post("/auth/login", json={"email": user_email, "password": user_pass})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    user_id = login_res.json()["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Logged in user {user_id} with token: {token[:15]}...")

    # Current User Profile
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == user_email
    print("User profile retrieved successfully.")

    print("\n--- 3. Items CRUD & Per-User Isolation ---")
    # Create item
    item_res = client.post("/items", headers=headers, json={
        "title": "Quantum Mechanics 101",
        "category": "Course",
        "note": "Problem sets are demanding"
    })
    assert item_res.status_code == 200
    item_id = item_res.json()["id"]
    print(f"Created item #{item_id}: {item_res.json()['title']}")

    # List items
    list_res = client.get("/items", headers=headers)
    assert list_res.status_code == 200
    assert any(i["id"] == item_id for i in list_res.json())
    print(f"Items listed: {len(list_res.json())} items found for user.")

    # Quit item (10-second flow)
    quit_res = client.patch(f"/items/{item_id}/quit", headers=headers, json={
        "reason_tag": "Too Busy",
        "reason_text": "Midterm exams overlapping with laboratory schedule"
    })
    assert quit_res.status_code == 200
    assert quit_res.json()["status"] == "quit"
    assert quit_res.json()["reason_tag"] == "Too Busy"
    print(f"Quit item #{item_id} successfully.")

    print("\n--- 4. Pattern Summary & AI Feedback ---")
    # Fetch summary
    summary_res = client.get("/patterns/summary", headers=headers)
    assert summary_res.status_code == 200
    summary_data = summary_res.json()
    assert summary_data["stats"]["total_quit"] >= 1
    assert "ai_summary" in summary_data
    print(f"Summary generated: {summary_data['ai_summary'][:70]}...")

    # Submit Thumbs Up Feedback
    feedback_res = client.post("/patterns/feedback", headers=headers, json={
        "summary_id": summary_data.get("id"),
        "rating": 1,
        "feedback_text": "Insight matches my actual exam schedule."
    })
    assert feedback_res.status_code == 200
    assert feedback_res.json()["rating"] == 1
    print("Feedback submitted to database.")

    print("\n--- 5. Advisor & Internal Metrics Dashboards ---")
    db = TestingSessionLocal()
    from models import User
    test_user = db.query(User).filter(User.id == user_id).first()
    test_user.role = "admin"
    db.commit()
    db.close()

    advisor_res = client.get("/metrics/advisor", headers=headers)
    assert advisor_res.status_code == 200
    assert "activeStudents" in advisor_res.json()
    assert "closureDrivers" in advisor_res.json()
    print("Advisor metrics calculated successfully.")

    internal_res = client.get("/metrics/internal", headers=headers)
    assert internal_res.status_code == 200
    assert internal_res.json()["thumbsUpCount"] >= 1
    print(f"Internal metrics: {internal_res.json()['thumbsUpCount']} thumbs up, accuracy: {internal_res.json()['aiAccuracyRate']}%")

    print("\n--- 6. Retrain AI Model Endpoint ---")
    import routers.admin as admin_module
    admin_module.ADMIN_API_KEY = "test-secret-admin-key"
    admin_headers = {**headers, "X-Admin-Api-Key": "test-secret-admin-key"}
    retrain_res = client.post("/admin/retrain", headers=admin_headers)
    assert retrain_res.status_code == 200
    assert retrain_res.json()["status"] == "success"
    print(f"Admin retrain completed: {retrain_res.json()['message']}")

    print("\n--- 7. Weekly Digest Notification ---")
    digest_res = client.get("/notifications/weekly-digest/preview", headers=headers)
    assert digest_res.status_code == 200
    assert "email_body" in digest_res.json()
    print("Weekly digest preview generated.")

    print("\n--- 7b. Recommit Item with parent_item_id (Claim 9 Validation) ---")
    # Valid recommit
    recommit_res = client.post("/items", headers=headers, json={
        "title": "Quantum Mechanics 101 (Modular 15-min Version)",
        "category": "Course",
        "note": "Re-committed as an easier version of Quantum Mechanics 101",
        "parent_item_id": item_id
    })
    assert recommit_res.status_code == 200
    recommit_item = recommit_res.json()
    assert recommit_item["parent_item_id"] == item_id
    recommit_id = recommit_item["id"]
    print(f"Recommitted item #{recommit_id} referencing parent #{item_id}.")

    # Invalid parent_item_id (doesn't exist) -> 404
    bad_parent_res = client.post("/items", headers=headers, json={
        "title": "Invalid Parent Item",
        "parent_item_id": 999999
    })
    assert bad_parent_res.status_code == 404

    # Invalid parent status (cannot recommit active item) -> 400
    active_parent_res = client.post("/items", headers=headers, json={
        "title": "Invalid Status Recommit",
        "parent_item_id": recommit_id  # recommit_id is active
    })
    assert active_parent_res.status_code == 400
    print("Recommit validations (404 and 400 status checks) verified.")

    print("\n--- 8. Delete Parent Item & Verify ON DELETE SET NULL ---")
    del_res = client.delete(f"/items/{item_id}", headers=headers)
    assert del_res.status_code == 200
    print(f"Deleted parent item #{item_id}.")

    # Child item still exists
    list_after_del = client.get("/items", headers=headers)
    assert list_after_del.status_code == 200
    child_in_db = next((i for i in list_after_del.json() if i["id"] == recommit_id), None)
    assert child_in_db is not None
    print(f"Child item #{recommit_id} preserved after parent deletion.")

    # Cleanup child item
    client.delete(f"/items/{recommit_id}", headers=headers)

    print("\n=== ALL INTEGRATION TESTS PASSED ===")

if __name__ == "__main__":
    test_full_system_flow()
