#!/bin/bash

# Set working directory
cd /home/samo/Data/Pixel/TaskLord

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backend with venv
cd backend
source venv/bin/activate
python app.py >> ../logs/backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm start >> ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Log the PIDs
echo "Backend PID: $BACKEND_PID" >> ../logs/startup.log
echo "Frontend PID: $FRONTEND_PID" >> ../logs/startup.log
echo "Started at: $(date)" >> ../logs/startup.log

# Wait for all background processes
wait
