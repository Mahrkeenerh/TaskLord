from datetime import datetime, timedelta
import json
import os
import shutil
from werkzeug.utils import secure_filename

from models import Task, Project, Client


class Storage:
    def __init__(self, path):
        self.path = path
        self.project_path = os.path.join(self.path, 'projects.json')
        self.clients_path = os.path.join(self.path, 'clients.json')
        self.recurring_path = os.path.join(self.path, 'recurring.json')
        self.logos_path = os.path.join(self.path, 'logos')

        self.date = None
        self.data = {}

        self.recurring_tasks = None
        self.projects = None
        self.clients = None

        os.makedirs(os.path.join(self.path, 'months'), exist_ok=True)
        os.makedirs(self.logos_path, exist_ok=True)

        self.load_projects()
        self.load_clients()
        self.load_recurring_tasks()

    @property
    def month_path(self):
        return os.path.join(self.path, 'months', f'{self.date.year}_{self.date.month}.json')

    def load_month(self, year, month):
        """Load all tasks for a given month."""
        self.date = datetime(year, month, 1)
        if not os.path.exists(self.month_path):
            self.data = {'tasks': [], 'summary': {}}
            self._apply_recurring_tasks()
            self._update_summary()
        else:
            with open(self.month_path) as f:
                data = json.load(f)
                self.data = {'tasks': [Task(**task) for task in data['tasks']], 'summary': data.get('summary', {})}

        return self.data

    def _dump_month(self):
        """Dump the data for a given month to a file."""
        # Sort the tasks by date
        self.data['tasks'] = sorted(self.data['tasks'], key=lambda x: x.date)

        with open(self.month_path, 'w') as f:
            json.dump(self.data, f, indent=2, default=lambda x: x.__dict__)

    def _update_summary(self):
        """Update the summary of a month."""
        summary = {}

        for task in self.data["tasks"]:
            project_id = task.project_id
            client_id = task.client_id

            if client_id not in summary:
                summary[client_id] = {"projects": {}, "total_hours": 0, "total_amount": 0}
            if project_id not in summary[client_id]["projects"]:
                summary[client_id]["projects"][project_id] = {"total_hours": 0, "total_amount": 0}

            project = self._get_project(project_id)
            hours = task.hours
            summary[client_id]["projects"][project_id]["total_hours"] += hours
            summary[client_id]["projects"][project_id]["total_amount"] += hours * project.hourly_rate
            summary[client_id]["total_hours"] += hours
            summary[client_id]["total_amount"] += hours * project.hourly_rate

        self.data["summary"] = summary

    # Tasks

    def save_task(self, task):
        """Save a new task to the storage."""
        date = datetime.strptime(task.date, '%Y-%m-%d')
        self.load_month(date.year, date.month)

        # Save the task
        self.data['tasks'].append(task)

        if task.recurring:
            self.recurring_tasks.append(task)
            with open(self.recurring_path, 'w') as f:
                json.dump(self.recurring_tasks, f, indent=2, default=lambda x: x.__dict__)

            self._apply_recurring_task(task)

        self._update_summary()
        self._dump_month()

    def update_task(self, task):
        """Update an existing task in the storage."""
        for i, t in enumerate(self.data['tasks']):
            if t.id == task.id:
                was_recurring = t.recurring or task.recurring
                t.update(task)

                if was_recurring:
                    self._update_recurring_task(task)

                self.data['tasks'][i] = t
                break

        self._update_summary()
        self._dump_month()

    def delete_task(self, task_id):
        """Delete a task from the storage."""
        for task in self.data['tasks']:
            if task.id == task_id:
                if task.recurring:
                    self._delete_recurring_task(task)
                else:
                    self.data['tasks'].remove(task)

                self._update_summary()
                self._dump_month()
                break

    # Recurring tasks

    def load_recurring_tasks(self):
        """Load all recurring tasks."""
        if not os.path.exists(self.recurring_path):
            self.recurring_tasks = []
        else:
            with open(self.recurring_path) as f:
                self.recurring_tasks = [Task(**task) for task in json.load(f)]

        return self.recurring_tasks

    def _should_add_recurring_task(self, task, date):
        """Check if a recurring task should be added on a specific date."""
        task_date = datetime.strptime(task.date, "%Y-%m-%d")
        if task.recurring == 'daily':
            return True
        elif task.recurring == 'weekly':
            return date.weekday() == task_date.weekday()
        elif task.recurring == 'monthly':
            return date.day == task_date.day
        return False

    def _apply_recurring_task(self, task):
        """Apply a recurring task to current month."""
        if task.deleted:
            return

        task_date = datetime.strptime(task.date, '%Y-%m-%d')
        start_of_month = self.date
        end_of_month = (start_of_month.replace(month=start_of_month.month % 12 + 1, day=1) - timedelta(days=1))
        end_of_month = end_of_month.replace(year=start_of_month.year)

        current_date = start_of_month - timedelta(days=1)

        while current_date <= end_of_month:
            if current_date < task_date:
                current_date += timedelta(days=1)
                continue

            current_date += timedelta(days=1)

            if self._should_add_recurring_task(task, current_date):
                new_task = Task(
                    id=f"{task.id}_{current_date.strftime('%Y-%m-%d')}",
                    project_id=task.project_id,
                    client_id=task.client_id,
                    date=current_date.strftime("%Y-%m-%d"),
                    hours=task.hours,
                    title=task.title,
                    notes=task.notes,
                    recurring=task.recurring
                )
                self.data['tasks'].append(new_task)

    def _apply_recurring_tasks(self):
        """Apply all recurring tasks to current month."""
        for task in self.recurring_tasks:
            self._apply_recurring_task(task)

    def _update_recurring_task(self, task):
        """Update a recurring task in the storage. Update all future tasks too."""
        recurring_task = [t for t in self.recurring_tasks if task.id.startswith(t.id)][0]
        recurring_task_date = datetime.strptime(recurring_task.date, '%Y-%m-%d')
        task_date = datetime.strptime(task.date, '%Y-%m-%d')
        recurring_task_date = recurring_task_date if recurring_task_date > task_date else task_date

        if task.recurring:
            recurring_task.update(task)

            for future_task in self.data['tasks']:
                if future_task.id.startswith(recurring_task.id) and datetime.strptime(future_task.date, '%Y-%m-%d') >= recurring_task_date and future_task.recurring:
                    future_task.update(task)

            with open(self.recurring_path, 'w') as f:
                json.dump(self.recurring_tasks, f, indent=2, default=lambda x: x.__dict__)

            self._update_summary()
            self._dump_month()

            # update upcoming months
            for month in os.listdir(os.path.join(self.path, 'months')):
                year, month = map(int, month.replace('.json', '').split('_'))
                if datetime(year, month, 1) > recurring_task_date:
                    self.load_month(year, month)
                    for future_task in self.data['tasks']:
                        if future_task.id.startswith(recurring_task.id) and future_task.recurring:
                            future_task.update(task)
                    self._update_summary()
                    self._dump_month()

            # Load the current month again
            self.load_month(recurring_task_date.year, recurring_task_date.month)

    def _delete_recurring_task(self, task):
        """Delete a recurring task from the storage."""
        recurring_task = [t for t in self.recurring_tasks if task.id.startswith(t.id)][0]
        recurring_task.delete()
        remove_date = datetime.strptime(task.date, '%Y-%m-%d')

        for future_task in reversed(self.data['tasks']):
            if future_task.id.startswith(recurring_task.id) and datetime.strptime(future_task.date, '%Y-%m-%d') >= remove_date and future_task.recurring:
                self.data['tasks'].remove(future_task)

        with open(self.recurring_path, 'w') as f:
            json.dump(self.recurring_tasks, f, indent=2, default=lambda x: x.__dict__)

        self._update_summary()
        self._dump_month()

        # update upcoming months
        for month in os.listdir(os.path.join(self.path, 'months')):
            year, month = map(int, month.replace('.json', '').split('_'))
            if datetime(year, month, 1) > remove_date:
                self.load_month(year, month)
                for future_task in self.data['tasks']:
                    if future_task.id.startswith(recurring_task.id):
                        self.data['tasks'].remove(future_task)
                self._update_summary()
                self._dump_month()

        # Load the current month again
        self.load_month(remove_date.year, remove_date.month)

    # Projects

    def load_projects(self):
        """Load all projects."""
        if not os.path.exists(self.project_path):
            self.projects = []
        else:
            with open(self.project_path) as f:
                self.projects = [Project(**project) for project in json.load(f)]

        return self.projects

    def _get_project(self, project_id):
        """Get a specific project by ID."""
        for project in self.projects:
            if project.id == project_id:
                return project
        return None

    def save_project(self, project):
        """Save a new project to the storage."""
        self.projects.append(project)

        # Sort the projects by name
        self.projects = sorted(self.projects, key=lambda x: x.name)

        with open(self.project_path, 'w') as f:
            json.dump(self.projects, f, indent=2, default=lambda x: x.__dict__)

    def update_project(self, project):
        """Update an existing project in the storage."""
        for p in self.projects:
            if p.id == project.id:
                p.update(project)
                break

        with open(self.project_path, 'w') as f:
            json.dump(self.projects, f, indent=2, default=lambda x: x.__dict__)

    def delete_project(self, project_id):
        """Delete a project from the storage."""
        self.projects = [p for p in self.projects if p.id != project_id]

        with open(self.project_path, 'w') as f:
            json.dump(self.projects, f, indent=2, default=lambda x: x.__dict__)

    # Clients

    def load_clients(self):
        """Load all clients."""
        if not os.path.exists(self.clients_path):
            self.clients = []
        else:
            with open(self.clients_path) as f:
                self.clients = [Client(**client) for client in json.load(f)]

        return self.clients

    def get_client_projects(self, client_id):
        """Get all projects for a specific client."""
        return [p for p in self.projects if p.client_id == client_id]

    def save_client(self, client):
        """Save a new client to the storage."""
        self.clients.append(client)

        # Sort the clients by name
        self.clients = sorted(self.clients, key=lambda x: x.name)

        with open(self.clients_path, 'w') as f:
            json.dump(self.clients, f, indent=2, default=lambda x: x.__dict__)

    def update_client(self, client):
        """Update an existing client in the storage."""
        for c in self.clients:
            if c.id == client.id:
                c.update(client)
                break

        with open(self.clients_path, 'w') as f:
            json.dump(self.clients, f, indent=2, default=lambda x: x.__dict__)

    def save_client_logo(self, client_id, file):
        """Save a client logo file and return the path."""
        if not file:
            return None

        filename = secure_filename(f"{client_id}_{file.filename}")
        file_path = os.path.join(self.logos_path, filename)

        # Remove old logo if it exists
        old_logo = self._get_client_logo(client_id)
        if old_logo and os.path.exists(old_logo):
            os.remove(old_logo)
            
        file.save(file_path)
        return f"/api/logos/{filename}"

    def _get_client_logo(self, client_id):
        """Get the logo path for a client."""
        if not os.path.exists(self.logos_path):
            return None

        for filename in os.listdir(self.logos_path):
            if filename.startswith(f"{client_id}_"):
                return os.path.join(self.logos_path, filename)
        return None

    def delete_client(self, client_id):
        """Delete a client and their logo from storage."""
        # Delete logo if it exists
        logo_path = self._get_client_logo(client_id)
        if logo_path and os.path.exists(logo_path):
            os.remove(logo_path)

        # Existing client deletion code
        self.clients = [c for c in self.clients if c.id != client_id]
        with open(self.clients_path, 'w') as f:
            json.dump(self.clients, f, indent=2, default=lambda x: x.__dict__)
