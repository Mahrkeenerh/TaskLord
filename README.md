# Time Tracking Application

Yet another full-stack web application for tracking time spent on client projects, managing clients, and generating summaries. Built with React, Flask, and modern web technologies.

## Features

- 📅 Interactive calendar interface for time tracking
- 👥 Client and project management
- 🔄 Support for recurring tasks
- 📊 Detailed time and financial summaries
- 📸 Photo mode for clean screenshots/exports
- ⌨️ Keyboard shortcuts for quick navigation
- 🎨 Project color coding
- 📱 Responsive design
- 🖼️ Client logo management

## Prerequisites

- Python 3.x
- Node.js and npm
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Mahrkeenerh/TaskLord
cd TaskLord
```

2. Set up the backend:
```bash
pip install flask flask-cors werkzeug
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

## Running the Application

Run the included `run.bat` file, which will:
1. Start the backend server (port 3002)
2. Start the frontend development server (port 3001)
3. Open the application at `http://localhost:3001`

## Data Storage

The application uses a file-based storage system with the following structure:
- `months/`: Contains JSON files for each month's time entries
- `logos/`: Stores client logo files
- `clients.json`: Client information
- `projects.json`: Project definitions
- `recurring.json`: Recurring task configurations

## Features in Detail

### Time Tracking
- Add, edit, and delete time entries
- Set up recurring tasks (daily, weekly, monthly)
- Associate entries with specific projects and clients
- Add notes to time entries

### Recurring Tasks
- Create tasks that repeat daily, weekly, or monthly
- Editing a recurring task:
  - Changes made to a recurring task will update all subsequent instances of that task
  - To modify a single instance, uncheck the "recurring" option when editing - this unlinks it from the recurring series
  - Historical entries (before the edited date) remain unchanged
- Deleting a recurring task:
  - Removes the selected task and all future occurrences
  - Past entries remain unchanged

### Project Management
- Create and manage multiple projects
- Assign projects to clients
- Set custom colors for visual organization
- Configure hourly rates per project

### Client Management
- Create and manage client profiles
- Upload and manage client logos
- View client-specific project lists
- Generate client-specific summaries

### Reporting
- Monthly summaries by client and project
- Hours tracked and financial calculations
- Export-friendly photo mode for clean visuals

### User Interface
- Responsive calendar view
- Quick-access task creation
- Filtering by client and project

## Tech Stack

### Frontend
- React 18
- Tailwind CSS for styling
- Headless UI for accessible components
- Lucide React for icons

### Backend
- Flask (Python)
- Flask-CORS for cross-origin resource sharing
- Custom file-based storage system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

### Issues

If you encounter any bugs or have feature requests:
1. Check the Issues tab to see if it has already been reported
2. If not, create a new issue with:
   - Clear description of the problem or feature request
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior (for bugs)
   - Screenshots if applicable

## Acknowledgments

This project was developed with significant assistance from Claude, an AI assistant by Anthropic.
