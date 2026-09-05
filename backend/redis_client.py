import os
import time
import redis
from security_logger import security_logger

REDIS_URL = os.environ.get("REDIS_URL")
redis_client = None

if REDIS_URL:
    try:
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        # Test connection
        redis_client.ping()
        security_logger.info("Successfully connected to Redis.")
    except Exception as e:
        security_logger.error(f"Failed to connect to Redis: {e}")
        redis_client = None
else:
    security_logger.warning("REDIS_URL not set. Falling back to in-memory dictionary for rate limiting (NOT RECOMMENDED for production).")

# In-memory fallbacks if Redis is not available
_fallback_dict = {}

def check_rate_limit(key: str, max_requests: int, window_seconds: int) -> bool:
    """
    Check if a key has exceeded its rate limit using a sliding window.
    Returns True if allowed, False if limit exceeded.
    """
    now = time.time()
    
    if redis_client:
        try:
            pipeline = redis_client.pipeline()
            # Remove timestamps older than window
            pipeline.zremrangebyscore(key, 0, now - window_seconds)
            # Add current request
            pipeline.zadd(key, {str(now): now})
            # Count elements
            pipeline.zcard(key)
            # Set expiry on the key so it cleans up itself
            pipeline.expire(key, window_seconds)
            
            results = pipeline.execute()
            count = results[2]
            return count <= max_requests
        except Exception as e:
            security_logger.error(f"Redis rate limit check failed: {e}")
            # Fall through to dictionary check if Redis fails
            
    # Fallback in-memory check
    timestamps = _fallback_dict.get(key, [])
    timestamps = [t for t in timestamps if now - t < window_seconds]
    timestamps.append(now)
    _fallback_dict[key] = timestamps
    
    # Periodically clean up fallback dict (simple approach)
    if len(_fallback_dict) > 10000:
        _fallback_dict.clear()
        
    return len(timestamps) <= max_requests

def check_cooldown(key: str, cooldown_seconds: int) -> tuple[bool, int]:
    """
    Check if a key is in cooldown.
    Returns (True, 0) if allowed, (False, remaining_seconds) if blocked.
    """
    if redis_client:
        try:
            ttl = redis_client.ttl(key)
            if ttl > 0:
                return False, ttl
            return True, 0
        except Exception as e:
            security_logger.error(f"Redis cooldown check failed: {e}")
            
    # Fallback in-memory check
    now = time.time()
    last_action = _fallback_dict.get(f"cooldown:{key}")
    
    if last_action and (now - last_action) < cooldown_seconds:
        remaining = int(cooldown_seconds - (now - last_action))
        return False, remaining
        
    return True, 0

def set_cooldown(key: str, cooldown_seconds: int):
    """Set a cooldown for a key."""
    if redis_client:
        try:
            redis_client.setex(key, cooldown_seconds, "1")
            return
        except Exception as e:
            security_logger.error(f"Redis set cooldown failed: {e}")
            
    # Fallback
    _fallback_dict[f"cooldown:{key}"] = time.time()
