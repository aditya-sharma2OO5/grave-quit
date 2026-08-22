from models import User

class MockUser:
    id = 1

def get_current_user():
    """
    Shared auth dependency used by all routers.
    Currently returns a hardcoded MockUser with id=1 for development.
    
    TODO: Replace with real Supabase JWT validation before production:
    def get_current_user(token: str = Depends(oauth2_scheme)):
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, ...)
        return db.query(User).filter(User.id == payload["sub"]).first()
    """
    return MockUser()
