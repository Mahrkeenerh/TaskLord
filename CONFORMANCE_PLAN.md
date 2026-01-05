# Plan: Update TaskLord to Conform to Service Implementation Guide

## Overview

Update TaskLord repository to fully conform to the Service Implementation Guide for the Service Admin Dashboard. Convert from system-service to user-service with dynamic paths.

## Current State

- **README.md**: Exists (needs update)
- **tasklord.service**: In root (needs move + rewrite)
- **service.json**: Missing
- **install.sh**: Missing
- **uninstall.sh**: Missing
- **AGENT.md**: Missing
- **systemd/**: Directory missing

## Configuration Decisions

| Setting | Value |
|---------|-------|
| Service Type | `user-service` |
| Paths | Dynamic (SCRIPT_DIR detection) |
| UI Category | Productivity |
| UI Icon | `⏱️` (time tracking) |
| Network Ports | 3001 (frontend), 3002 (backend) |

---

## Implementation Steps

### Step 1: Create `systemd/` directory and move service file

Create directory structure and new user-service file.

**Create**: `systemd/tasklord.service`
```ini
[Unit]
Description=TaskLord Time Tracking Application
After=network.target

[Service]
Type=simple
WorkingDirectory=%h/Data/Pixel/TaskLord
ExecStart=/bin/bash %h/Data/Pixel/TaskLord/run.sh
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

Note: `%h` expands to user's home directory in user services. For fully dynamic paths, the install script will need to generate this file.

**Delete**: `tasklord.service` (root-level file)

---

### Step 2: Create `service.json`

**Create**: `service.json`
```json
{
  "name": "TaskLord",
  "version": "1.0.0",
  "description": "Time tracking application for client projects",
  "type": "user-service",

  "systemd": {
    "unit": "systemd/tasklord.service",
    "timer": null,
    "service_name": "tasklord.service"
  },

  "network": {
    "port": 3001,
    "health": null
  },

  "paths": {
    "config": null,
    "logs": "journalctl",
    "install": "install.sh",
    "uninstall": "uninstall.sh"
  },

  "ui": {
    "icon": "⏱️",
    "category": "Productivity"
  }
}
```

---

### Step 3: Create `install.sh`

**Create**: `install.sh` (executable)

```bash
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_NAME="tasklord.service"

echo "=== Installing TaskLord ==="

# Check dependencies
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: Node.js/npm is required"
    exit 1
fi

# Create backend virtual environment if needed
if [ ! -d "$SCRIPT_DIR/backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv "$SCRIPT_DIR/backend/venv"
fi

# Install backend dependencies
echo "Installing backend dependencies..."
"$SCRIPT_DIR/backend/venv/bin/pip" install -q flask flask-cors werkzeug

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install --silent

# Generate systemd service file with correct paths
echo "Generating systemd service file..."
mkdir -p "$SCRIPT_DIR/systemd"
cat > "$SCRIPT_DIR/systemd/tasklord.service" << EOF
[Unit]
Description=TaskLord Time Tracking Application
After=network.target

[Service]
Type=simple
WorkingDirectory=$SCRIPT_DIR
ExecStart=/bin/bash $SCRIPT_DIR/run.sh
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
EOF

# Symlink systemd service (user-level)
echo "Installing systemd user service..."
mkdir -p ~/.config/systemd/user
ln -sf "$SCRIPT_DIR/systemd/tasklord.service" ~/.config/systemd/user/
systemctl --user daemon-reload

echo "=== Installation complete ==="
echo ""
echo "Commands:"
echo "  Start:   systemctl --user start tasklord"
echo "  Stop:    systemctl --user stop tasklord"
echo "  Status:  systemctl --user status tasklord"
echo "  Logs:    journalctl --user -u tasklord -f"
echo "  Enable:  systemctl --user enable tasklord"
```

---

### Step 4: Create `uninstall.sh`

**Create**: `uninstall.sh` (executable)

```bash
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_NAME="tasklord.service"

echo "=== Uninstalling TaskLord ==="

# Stop and disable service
systemctl --user stop "$SERVICE_NAME" 2>/dev/null || true
systemctl --user disable "$SERVICE_NAME" 2>/dev/null || true

# Remove systemd symlink
rm -f ~/.config/systemd/user/"$SERVICE_NAME"
systemctl --user daemon-reload

echo "=== Uninstallation complete ==="
echo "Repository remains at: $SCRIPT_DIR"
echo ""
echo "To fully remove, delete the repository directory manually."
```

---

### Step 5: Create `AGENT.md`

**Create**: `AGENT.md`

```markdown
# TaskLord - Agent Context

## Overview
TaskLord is a time tracking web application with a React frontend (port 3001) and Flask backend (port 3002).

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
- **Frontend**: React app on port 3001
- **Backend**: Flask API on port 3002
- **Data**: File-based JSON storage in repository

## Troubleshooting

### Service won't start
1. Check logs: `journalctl --user -u tasklord -n 50`
2. Verify ports available: `lsof -i :3001` and `lsof -i :3002`
3. Check if venv exists: `ls backend/venv`

### Port already in use
```bash
# Find process using port
lsof -i :3001
lsof -i :3002
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
```

---

### Step 6: Update `run.sh`

**Modify**: `run.sh`

Make paths relative/dynamic instead of hardcoded:

```bash
#!/bin/bash

# Set working directory to script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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
```

---

### Step 7: Update `README.md`

**Modify**: `README.md`

Replace the manual systemd installation section with:

```markdown
### Auto-Start on Boot (Linux with systemd)

To have TaskLord start automatically when you log in:

1. Run the install script:
```bash
./install.sh
```

2. Enable and start the service:
```bash
systemctl --user enable tasklord
systemctl --user start tasklord
```

3. Check status:
```bash
systemctl --user status tasklord
```

4. View logs:
```bash
journalctl --user -u tasklord -f
```

5. To uninstall:
```bash
./uninstall.sh
```
```

---

### Step 8: Clean up old files

**Delete**: `tasklord.service` (root-level, replaced by `systemd/tasklord.service`)

---

## Files Summary

| Action | File |
|--------|------|
| Create | `service.json` |
| Create | `install.sh` |
| Create | `uninstall.sh` |
| Create | `AGENT.md` |
| Create | `systemd/tasklord.service` |
| Modify | `run.sh` |
| Modify | `README.md` |
| Delete | `tasklord.service` |

---

## Validation

After implementation, verify:
- [ ] `./install.sh` runs without errors
- [ ] `systemctl --user start tasklord` works
- [ ] App accessible at http://localhost:3001
- [ ] `./uninstall.sh` cleanly removes service
- [ ] Running `./install.sh` twice works (idempotent)
