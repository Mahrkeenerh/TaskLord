# TaskLord

Time tracking for freelancers. Track hours, manage clients/projects, generate summaries.

## Features

- Calendar-based time entry with recurring tasks
- Client and project management with hourly rates
- Monthly summaries with financial calculations
- Photo mode for clean exports

## Requirements

- Python 3.x
- Node.js and npm

## Quick Start

```bash
./install.sh    # Install dependencies & build frontend
./run.sh        # Start server at localhost:3000
```

## Auto-Start (Linux)

```bash
./install.sh
systemctl --user enable --now tasklord
```

Manage the service:
```bash
systemctl --user status tasklord       # Check status
journalctl --user -u tasklord -f       # View logs
./uninstall.sh                         # Remove service
```

## Data

All data stored in `backend/data/` as JSON files:
- `clients.json` - Client profiles
- `projects.json` - Projects with rates
- `months/` - Monthly time entries
- `logos/` - Client logos
