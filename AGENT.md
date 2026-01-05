# TaskLord - Agent Context

## Overview
TaskLord is a time tracking web application. Flask backend (port 3000) serves both the API and the static React frontend build.

## Quick Commands

```bash
# Start/stop/restart
systemctl --user start tasklord
systemctl --user stop tasklord
systemctl --user restart tasklord

# View logs
journalctl --user -u tasklord -f

# Check status
systemctl --user status tasklord
```

## Architecture
- **Backend**: Flask API on port 3000 (also serves static React build)
- **Data**: File-based JSON storage in repository

## Troubleshooting

### Service won't start
1. Check logs: `journalctl --user -u tasklord -n 50`
2. Verify port available: `lsof -i :3000`
3. Check if venv exists: `ls backend/venv`
4. Test health endpoint: `curl http://localhost:3000/health`

### Port already in use
```bash
# Find process using port
lsof -i :3000
# Kill if needed
kill -9 <PID>
```

### Frontend won't build
```bash
cd frontend
rm -rf node_modules
npm install
```

### Backend errors
```bash
cd backend
source venv/bin/activate
pip install flask flask-cors werkzeug
```
