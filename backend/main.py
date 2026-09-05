import os
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base, SessionLocal
from routers import patterns, items, admin, metrics, auth, digest
from security_logger import security_logger
from models import VerificationCode
from datetime import datetime, timezone

from sqlalchemy import text

# Create DB tables
Base.metadata.create_all(bind=engine)

# Ensure columns added to models exist in DB
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN DEFAULT TRUE;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_opt_in BOOLEAN DEFAULT FALSE;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;"))
        conn.execute(text("ALTER TABLE items ADD COLUMN IF NOT EXISTS note TEXT;"))
        conn.execute(text("ALTER TABLE pattern_summaries ADD COLUMN IF NOT EXISTS clusters JSON;"))
        conn.execute(text("ALTER TABLE pattern_summaries ADD COLUMN IF NOT EXISTS similar_entries JSON;"))
        conn.execute(text("ALTER TABLE pattern_summaries ADD COLUMN IF NOT EXISTS risk_explanation TEXT;"))
        conn.execute(text("ALTER TABLE verification_codes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;"))
        conn.commit()
except Exception as e:
    print(f"[Startup Warning] Schema column sync notice: {e}")

app = FastAPI(
    title="Gravequit API",
    description="A digital sanctuary for students to observe and retire commitments with clarity and zero guilt.",
    version="1.0.0"
)

# CORS: Explicit origin whitelist. Set ALLOWED_ORIGINS in .env for production.
# Default allows common local dev ports only.
_default_origins = "http://localhost:5173,http://localhost:5174,http://localhost:3000"
ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from redis_client import check_rate_limit

@app.middleware("http")
async def rate_limit_and_options_middleware(request: Request, call_next):
    # Always let CORS preflight OPTIONS pass through immediately
    if request.method == "OPTIONS":
        return await call_next(request)
        
    # Allow health checks and docs without rate limit
    if request.url.path in ["/", "/docs", "/openapi.json", "/redoc"]:
        return await call_next(request)
        
    # Extract real client IP behind reverse proxy (Render/AWS/etc)
    forwarded = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    
    # Check rate limit using Redis (120 req / min)
    is_allowed = check_rate_limit(f"global_rate_limit:{client_ip}", max_requests=120, window_seconds=60)
    
    if not is_allowed:
        security_logger.warning(f"Global rate limit exceeded (120 req/min) - IP: {client_ip}")
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please slow down and try again shortly."}
        )
    
    return await call_next(request)

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Include all Routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(patterns.router)
app.include_router(metrics.router)
app.include_router(admin.router)
app.include_router(digest.router)

@app.on_event("startup")
def cleanup_expired_codes():
    """Startup task to delete expired verification codes so the database doesn't grow unbounded."""
    try:
        db = SessionLocal()
        now = datetime.now(timezone.utc)
        deleted = db.query(VerificationCode).filter(VerificationCode.expires_at < now).delete()
        db.commit()
        db.close()
        if deleted > 0:
            security_logger.info(f"Cleaned up {deleted} expired verification codes on startup.")
    except Exception as e:
        security_logger.error(f"Failed to clean up expired verification codes: {e}")

@app.get("/")
def root():
    return {
        "name": "Gravequit API",
        "status": "operational",
        "version": "1.0.0",
        "sanctuary_mode": "active"
    }
