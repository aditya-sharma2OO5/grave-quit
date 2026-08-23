import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from dotenv import load_dotenv

load_dotenv()

import warnings

from fastapi import Header, HTTPException

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = secrets.token_hex(32)
    warnings.warn("JWT_SECRET_KEY is not set. Generated ephemeral key. Tokens will not persist across restarts.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")

def verify_admin_key(x_admin_api_key: str = Header(default=None, alias="X-Admin-Api-Key")):
    if ADMIN_API_KEY and x_admin_api_key != ADMIN_API_KEY:
        if not x_admin_api_key:
            raise HTTPException(status_code=401, detail="Admin API key required in 'X-Admin-Api-Key' header.")
        raise HTTPException(status_code=403, detail="Invalid Admin API key.")

def hash_password(password: str) -> str:
    """Generate a salted SHA-256 hash."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored salted hash."""
    if not hashed_password or '$' not in hashed_password:
        return False
    try:
        salt, stored_key = hashed_password.split('$', 1)
        key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return secrets.compare_digest(key.hex(), stored_key)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
