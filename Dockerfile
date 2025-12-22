# Use an official Python base image
FROM python:3.11-slim

# Install Node.js (for frontend)
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install additional dependencies
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev sqlite3 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy backend and frontend code
COPY backend ./backend
COPY frontend ./frontend

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r backend/requirements.txt

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install && npm run build

# Go back to /app
WORKDIR /app

# Expose ports (backend:8000, frontend:3000)
EXPOSE 8000 3000

# Install supervisor to run multiple processes
RUN pip install supervisor

# Copy supervisor config
COPY supervisord.conf ./supervisord.conf

# Start all services
CMD ["supervisord", "-c", "/app/supervisord.conf"]
