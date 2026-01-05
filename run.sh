#!/bin/bash

# Set working directory to script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Start Flask (serves both API and frontend)
cd backend
source venv/bin/activate
exec python app.py
