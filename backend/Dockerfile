# ==============================================================================
#  DarkSpot Atlas - FastAPI Backend Production Dockerfile (Subdirectory Context)
#  Multi-stage build optimized for security, size, memory efficiency, and speed
# ==============================================================================

# ---------- Stage 1: Builder ----------
FROM python:3.12-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---------- Stage 2: Production ----------
FROM python:3.12-slim AS production

# Security: run as non-root user
RUN groupadd -r darkspot && useradd -r -g darkspot -d /app -s /sbin/nologin darkspot

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application code into /app/backend to match import paths (from backend.app...)
COPY . /app/backend/

# Set proper ownership
RUN chown -R darkspot:darkspot /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app:/app/backend \
    PORT=8000 \
    HOST=0.0.0.0

# Document exposed port
EXPOSE 8000

# Health check - dynamically uses the PORT assigned by Render or local environment
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://127.0.0.1:${PORT:-8000}/health || exit 1

# Switch to non-root user
USER darkspot

# Start the FastAPI server with uvicorn
CMD ["sh", "-c", "exec uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WORKERS:-2} --timeout-keep-alive 120 --access-log"]
