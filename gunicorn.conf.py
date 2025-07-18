import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
backlog = 2048

# Worker processes - reduced for free tier
workers = 1  # Reduced from 4 to 1 for free tier memory limits
worker_class = "sync"
worker_connections = 1000
timeout = 120  # Increased timeout for slower free tier
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 500  # Reduced from 1000
max_requests_jitter = 50

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "roblox-experience-finder"

# Server mechanics
preload_app = True
daemon = False
pidfile = None
tmp_upload_dir = None

# SSL (not needed for Render)
keyfile = None
certfile = None
