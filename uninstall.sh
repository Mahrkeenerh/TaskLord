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
