import sys
import asyncio
import uvicorn

if __name__ == "__main__":
    # Force Windows to use ProactorEventLoop which supports subprocesses (required for Playwright)
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    # Run Uvicorn (reload=False is required for Windows + Playwright to work correctly)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
