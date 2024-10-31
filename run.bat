@echo off
:: Start backend
start cmd /k "cd backend && python app.py"

:: Start frontend
start cmd /k "cd frontend && npm start"
