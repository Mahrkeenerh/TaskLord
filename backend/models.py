from dataclasses import dataclass
from typing import Optional
import uuid


@dataclass
class Task:
    project_id: str
    client_id: str
    date: str
    hours: float
    title: str
    notes: str = ""
    recurring: Optional[str] = None
    id: str = None
    deleted: bool = False

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())

    @property
    def __dict__(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "client_id": self.client_id,
            "date": self.date,
            "hours": self.hours,
            "title": self.title,
            "notes": self.notes,
            "recurring": self.recurring,
            "deleted": self.deleted
        }

    def delete(self):
        self.deleted = True

    def update(self, task):
        self.project_id = task.project_id
        self.client_id = task.client_id
        self.hours = task.hours
        self.title = task.title
        self.notes = task.notes
        self.recurring = task.recurring


@dataclass
class Project:
    name: str
    client_id: str
    color: str
    hourly_rate: float
    hidden: bool = False
    id: str = None

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())

    @property
    def __dict__(self):
        return {
            "id": self.id,
            "name": self.name,
            "client_id": self.client_id,
            "color": self.color,
            "hourly_rate": self.hourly_rate,
            "hidden": self.hidden
        }

    def update(self, project):
        self.name = project.name
        self.client_id = project.client_id
        self.color = project.color
        self.hourly_rate = project.hourly_rate
        self.hidden = project.hidden


@dataclass
class Client:
    name: str
    logo_path: Optional[str] = None
    id: str = None

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())

    @property
    def __dict__(self):
        return {
            "id": self.id,
            "name": self.name,
            "logo_path": self.logo_path
        }

    def update(self, client):
        self.name = client.name
        if client.logo_path:
            self.logo_path = client.logo_path
