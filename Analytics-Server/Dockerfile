FROM python:3.13.1-slim-bookworm

WORKDIR /app

# Install curl and uv package manager
RUN apt update && apt install -y curl && \
    curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin/:$PATH"

# Copy project configuration files
COPY pyproject.toml uv.lock .python-version ./

# Additional dependencies needed for clickhouse-driver
# Install dependencies needed for clickhouse-driver and project dependencies
RUN apt install -y gcc python3-dev && \
    uv sync
# Copy application code
COPY main.py ./

# Set environment variables
ENV ENVIRONMENT="production" \
    PROJECT_NAME="Form Analytics Dashboard" \
    PROJECT_VERSION="1.0.0" \
    PORT=8080 \
    CLICKHOUSE_HOST="localhost" \
    CLICKHOUSE_PORT="9000" \
    CLICKHOUSE_USER="formAnalytics" \
    CLICKHOUSE_PASSWORD="test1234"

# Expose the port FastAPI will run on
EXPOSE 8000

# Run the FastAPI application with uvicorn
CMD ["sh", "-c", "uv run fastapi dev main.py", "--", "--network host"]