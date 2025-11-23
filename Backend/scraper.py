import logging
import re
import time
from typing import Optional, Dict
from browser import BrowserManager

async def scrape_attendance_logic(username: str, password: str) -> Optional[Dict]:
    """
    Scrapes attendance data using the singleton browser instance.
    """
    browser = BrowserManager.get_browser()
    if not browser:
        logging.error("Browser is not initialized.")
        return None

    context = await browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    )
    page = await context.new_page()

    # Optimize: Block unnecessary resources
    await page.route("**/*", lambda route: route.abort() 
        if route.request.resource_type in ["image", "media", "font"] 
        else route.continue_())

    try:
        logging.info(f"Starting scrape for user: {username}")
        step_start = time.time()
        
        # Navigate to main page
        await page.goto('http://mitsims.in/', wait_until='domcontentloaded')
        logging.info(f"Navigation took {time.time() - step_start:.2f}s")
        
        # Click Student Link
        step_start = time.time()
        await page.click('text=Student')
        await page.wait_for_selector('#studentForm', timeout=15000)
        logging.info(f"Student form load took {time.time() - step_start:.2f}s")

        # Fill Login Form
        await page.fill('#studentForm #inputStuId', username)
        await page.fill('#studentForm #inputPassword', password)

        # Click Login Button
        step_start = time.time()
        await page.click('#studentForm #studentSubmitButton', force=True)
        
        # Wait for login success
        try:
            await page.wait_for_selector('#studentName', timeout=30000, state='visible')
            logging.info(f"Login took {time.time() - step_start:.2f}s")
        except Exception:
            logging.error("Login failed or timed out.")
            return None

        # Wait for data to load
        step_start = time.time()
        try:
            # Wait for the first data fieldset (not the header buttons)
            # The header buttons are in a fieldset too, so we might need to be careful.
            # But usually the data loads quickly after login.
            await page.wait_for_selector(".x-fieldset", timeout=20000, state='visible')
            # Give it a tiny bit more time for the dynamic rows to populate if they are separate
            await page.wait_for_timeout(500) 
            logging.info(f"Data load took {time.time() - step_start:.2f}s")
        except Exception:
            logging.warning("Timeout waiting for fieldsets, continuing anyway...")

        # Get Student Info
        student_name_element = await page.query_selector('#studentName')
        student_name = await student_name_element.text_content() if student_name_element else "Unknown"
        student_name = student_name.strip()
        
        # Get Attendance Data
        step_start = time.time()
        fieldsets = await page.query_selector_all(".x-fieldset")
        if not fieldsets:
             # Fallback: try to find fieldsets again or reload
             fieldsets = await page.query_selector_all("fieldset")

        courses_data = []
        
        for fieldset in fieldsets:
            try:
                # Skip if blue color (header/footer usually)
                if await fieldset.query_selector(".x-fieldset-body .x-column-inner .x-field .x-form-display-field span[style*='color:blue']"):
                    continue

                # Course Name
                course_name_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div[id*='displayfield'][style*='width: 150px'] .x-form-display-field span")
                if not course_name_element:
                    course_name_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div:nth-child(2) .x-form-display-field span")
                
                if not course_name_element:
                    continue
                
                course_name = (await course_name_element.text_content()).strip()

                # Attended
                attended_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div[id*='displayfield']:nth-child(3) .x-form-display-field span")
                if not attended_element:
                    attended_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div[style*='width: 200px']:nth-child(3) .x-form-display-field span")
                
                attended = 0
                if attended_element:
                    txt = await attended_element.text_content()
                    digits = ''.join(c for c in txt if c.isdigit())
                    attended = int(digits) if digits else 0

                # Conducted
                conducted_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div[id*='displayfield']:nth-child(4) .x-form-display-field span")
                if not conducted_element:
                    conducted_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div[style*='width: 200px']:nth-child(4) .x-form-display-field span")

                conducted = 0
                if conducted_element:
                    txt = await conducted_element.text_content()
                    digits = ''.join(c for c in txt if c.isdigit())
                    conducted = int(digits) if digits else 0

                # Percentage
                attendance_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div[id*='displayfield']:nth-child(5) .x-form-display-field span[style*='color']")
                if not attendance_element:
                     attendance_element = await fieldset.query_selector(".x-fieldset-body .x-column-inner div:nth-child(5) .x-form-display-field span")
                
                percentage = 0.0
                if attendance_element:
                    txt = await attendance_element.text_content()
                    # Extract float
                    match = re.search(r"(\d+\.?\d*)", txt)
                    if match:
                        percentage = float(match.group(1))
                elif conducted > 0:
                    percentage = round((attended / conducted) * 100, 2)

                if course_name:
                    courses_data.append({
                        "name": course_name,
                        "attended": attended,
                        "conducted": conducted,
                        "percentage": percentage
                    })

            except Exception as e:
                logging.error(f"Error processing fieldset: {e}")
                continue
        
        logging.info(f"Parsing took {time.time() - step_start:.2f}s")

        # Calculate Overall Percentage (Weighted)
        total_attended = sum(c["attended"] for c in courses_data)
        total_conducted = sum(c["conducted"] for c in courses_data)
        overall_percentage = round((total_attended / total_conducted * 100), 2) if total_conducted > 0 else 0.0

        return {
            "student_name": student_name,
            "roll_number": username,
            "overall_percentage": overall_percentage,
            "courses": courses_data
        }

    except Exception as e:
        logging.error(f"Scraping error: {e}")
        return None
    finally:
        await context.close()
