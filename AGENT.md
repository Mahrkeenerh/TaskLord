# TaskLord - Agent Context

## Overview
TaskLord is a time tracking web application with a React frontend (port 3000) and Flask backend (port 3072).

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
- **Frontend**: React app on port 3000
- **Backend**: Flask API on port 3072
- **Data**: File-based JSON storage in repository

## Troubleshooting

### Service won't start
1. Check logs: `journalctl --user -u tasklord -n 50`
2. Verify ports available: `lsof -i :3000` and `lsof -i :3072`
3. Check if venv exists: `ls backend/venv`
4. Test health endpoint: `curl http://localhost:3072/health`

### Port already in use
```bash
# Find process using port
lsof -i :3000
lsof -i :3072
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
