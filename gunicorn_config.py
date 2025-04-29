import os

# Gunicorn config variables
workers = int(os.getenv('GUNICORN_WORKERS', 2))  # Increase workers for better concurrency
threads = int(os.getenv('GUNICORN_THREADS', 2))  # Fewer threads, more processes
# Set a reasonable timeout (seconds)
timeout = int(os.getenv('GUNICORN_TIMEOUT', 120))
bind = f"0.0.0.0:{os.getenv('PORT', '8080')}"
worker_class = 'gthread'
keepalive = 120
