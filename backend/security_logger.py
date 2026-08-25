import logging
import sys

# Create a custom logger for security events
security_logger = logging.getLogger("gravequit.security")
security_logger.setLevel(logging.INFO)

# Avoid adding multiple handlers if the module is re-imported
if not security_logger.handlers:
    # We want logs to go to stdout for Vercel/Docker to capture
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    
    # Format: [TIME] [LEVEL] [LOGGER] - MESSAGE
    formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] SECURITY - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)
    
    security_logger.addHandler(handler)
    
    # Prevent the logs from propagating to the root uvicorn/fastapi logger 
    # so we don't get duplicate log entries in the console
    security_logger.propagate = False
