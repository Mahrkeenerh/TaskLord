from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from models import Task, Project, Client
from storage import Storage


app = Flask(__name__)
CORS(app)

storage = Storage('data')


@app.route('/api/tasks/<year>/<month>', methods=['GET'])
def get_tasks(year, month):
    """Get all tasks for a specific month."""
    return jsonify(storage.load_month(int(year), int(month)))

@app.route('/api/recurring-tasks', methods=['GET'])
def get_recurring_tasks():
    """Get all recurring tasks."""
    return jsonify(storage.load_recurring_tasks())

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task."""
    data = request.json
    task = Task(
        project_id=data['project_id'],
        client_id=data['client_id'],
        date=data['date'],
        hours=float(data['hours']),
        notes=data.get('notes', ''),
        recurring=data.get('recurring', None)
    )
    storage.save_task(task)
    return jsonify({"status": "success", "id": task.id})

@app.route('/api/tasks/<task_id>', methods=['PUT', 'DELETE'])
def manage_task(task_id):
    """Update or delete a specific task."""
    if request.method == 'DELETE':
        storage.delete_task(task_id)
        return jsonify({"status": "success"})

    data = request.json
    task = Task(
        id=task_id,
        project_id=data['project_id'],
        client_id=data['client_id'],
        date=data['date'],
        hours=float(data['hours']),
        notes=data.get('notes', ''),
        recurring=data.get('recurring', None)
    )
    storage.update_task(task)
    return jsonify({"status": "success"})

@app.route('/api/projects', methods=['GET', 'POST'])
def manage_projects():
    """Get all projects or create a new project."""
    if request.method == 'GET':
        return jsonify(storage.load_projects())

    data = request.json
    project = Project(
        name=data['name'],
        client_id=data['client_id'],
        color=data['color'],
        hourly_rate=float(data['hourly_rate'])
    )
    storage.save_project(project)
    return jsonify({"status": "success", "id": project.id})

@app.route('/api/projects/<project_id>', methods=['PUT', 'DELETE'])
def manage_specific_project(project_id):
    """Update or delete a specific project."""
    if request.method == 'DELETE':
        storage.delete_project(project_id)
        return jsonify({"status": "success"})

    data = request.json
    project = Project(
        id=project_id,
        name=data['name'],
        client_id=data['client_id'],
        color=data['color'],
        hourly_rate=float(data['hourly_rate'])
    )
    storage.update_project(project)
    return jsonify({"status": "success"})

@app.route('/api/projects/client/<client_id>', methods=['GET'])
def get_client_projects(client_id):
    """Get all projects for a specific client."""
    return jsonify(storage.get_client_projects(client_id))

@app.route('/api/clients', methods=['GET', 'POST'])
def manage_clients():
    """Get all clients or create a new client."""
    if request.method == 'GET':
        return jsonify(storage.load_clients())

    # Handle multipart form data for logo upload
    name = request.form.get('name')
    logo = request.files.get('logo')
    
    client = Client(name=name)
    storage.save_client(client)
    
    if logo:
        logo_path = storage.save_client_logo(client.id, logo)
        client.logo_path = logo_path
        storage.update_client(client)

    return jsonify({"status": "success", "id": client.id})

@app.route('/api/clients/<client_id>', methods=['PUT', 'DELETE'])
def manage_specific_client(client_id):
    """Update or delete a specific client."""
    if request.method == 'DELETE':
        storage.delete_client(client_id)
        return jsonify({"status": "success"})

    name = request.form.get('name')
    logo = request.files.get('logo')
    
    client = Client(
        id=client_id,
        name=name
    )
    
    if logo:
        logo_path = storage.save_client_logo(client_id, logo)
        client.logo_path = logo_path
        
    storage.update_client(client)
    return jsonify({"status": "success"})

@app.route('/api/logos/<filename>')
def serve_logo(filename):
    """Serve client logo files."""
    return send_from_directory(storage.logos_path, filename)

if __name__ == '__main__':
    app.run(debug=True, port=3002)
