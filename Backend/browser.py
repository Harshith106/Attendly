import os
import logging
import asyncio
from typing import Optional
from playwright.async_api import async_playwright, Browser, Playwright

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

class BrowserManager:
    _playwright: Optional[Playwright] = None
    _browser: Optional[Browser] = None
    _semaphore: asyncio.Semaphore = None

    @classmethod
    async def start(cls):
        """Initialize the browser and semaphore."""
        logging.info("Starting up: Launching browser...")
        
        # Initialize semaphore
        max_concurrent = int(os.getenv("MAX_CONCURRENT_SCRAPES", "3"))
        cls._semaphore = asyncio.Semaphore(max_concurrent)
        
        try:
            cls._playwright = await async_playwright().start()
            cls._browser = await cls._playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-setuid-sandbox',
                    '--disable-software-rasterizer',
                    '--disable-extensions',
                ]
            )
            logging.info("Browser launched successfully.")
        except Exception as e:
            logging.error(f"Failed to launch browser: {e}")
            raise

    @classmethod
    async def stop(cls):
        """Close the browser and playwright."""
        logging.info("Shutting down: Closing browser...")
        if cls._browser:
            await cls._browser.close()
        if cls._playwright:
            await cls._playwright.stop()

    @classmethod
    def get_browser(cls) -> Optional[Browser]:
        return cls._browser

    @classmethod
    def get_semaphore(cls) -> asyncio.Semaphore:
        return cls._semaphore
