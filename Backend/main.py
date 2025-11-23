import os
import sys
import logging
import asyncio
from contextlib import asynccontextmanager
from typing import Optional, Dict, List
from fastapi import FastAPI, HTTPException, Body
from browser import BrowserManager
from models import LoginRequest, AttendanceResponse
from scraper import scrape_attendance_logic

# Fix for Windows Event Loop (Required for Playwright)
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events:
    - Startup: Launch browser
    - Shutdown: Close browser
    """
    await BrowserManager.start()
    yield
    await BrowserManager.stop()

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(lifespan=lifespan)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scrape-attendance", response_model=AttendanceResponse)
async def scrape_attendance_endpoint(request: LoginRequest):
    # Acquire semaphore to limit concurrency
    semaphore = BrowserManager.get_semaphore()
    
    import time
    start_time = time.time()
    
    async with semaphore:
        data = await scrape_attendance_logic(request.username, request.password)
        
    end_time = time.time()
    duration = end_time - start_time
    logging.info(f"Scraping completed in {duration:.2f} seconds")
        
    if not data:
        raise HTTPException(status_code=400, detail="Login failed or could not fetch data")
    
    return data

@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "ok", "browser_ready": BrowserManager.get_browser() is not None}

# Mount static files (Frontend)
# Ensure the path is correct relative to where you run the server
# Assuming 'dist' is in the parent directory of 'Backend'
import os
frontend_dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")

if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")
    
    # Catch-all route for SPA (React Router)
    @app.get("/{full_path:path}")
    @app.head("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve index.html for any other route
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))
else:
    logging.warning(f"Frontend dist directory not found at {frontend_dist_path}. UI will not be served.")
