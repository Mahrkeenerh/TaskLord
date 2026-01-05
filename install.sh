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

# Build frontend for production
echo "Building frontend..."
npm run build

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
