FROM mcr.microsoft.com/playwright/python:v1.48.0-jammy

WORKDIR /app

# Install uv
RUN pip install uv

# Copy Backend project files
COPY Backend/pyproject.toml Backend/uv.lock ./
COPY Backend/*.py ./

# Copy frontend dist folder
COPY dist /dist

# Install dependencies
RUN uv sync --frozen --no-install-project

# Install browser binaries (ensure compatibility)
RUN uv run playwright install chromium

# Expose port
EXPOSE 8000

# Run the application
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
