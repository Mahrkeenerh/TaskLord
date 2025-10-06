#!/bin/bash

# Start backend with venv
cd backend && source venv/bin/activate && python app.py &

# Start frontend
cd frontend && npm start &

# Wait for all background processes
wait
