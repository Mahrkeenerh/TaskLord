from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime
import uuid


@dataclass
class RateChange:
    hourly_rate: float
    effective_date: Optional[str] = None  # YYYY-MM-DD format, None for original rate

    @property
    def __dict__(self):
        return {
            "hourly_rate": self.hourly_rate,
            "effective_date": self.effective_date
        }


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
    rate_changes: List[RateChange]
    hidden: bool = False
    id: str = None

    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())
        # Convert dict list to RateChange objects if needed
        if self.rate_changes and isinstance(self.rate_changes[0], dict):
            self.rate_changes = [RateChange(**rc) for rc in self.rate_changes]

    @property
    def __dict__(self):
        return {
            "id": self.id,
            "name": self.name,
            "client_id": self.client_id,
            "color": self.color,
            "rate_changes": [rc.__dict__ for rc in self.rate_changes],
            "hidden": self.hidden
        }

    def get_rate_for_date(self, date_str: str) -> float:
        """Get the applicable hourly rate for a given date.

        Args:
            date_str: Date in YYYY-MM-DD format

        Returns:
            The hourly rate effective on that date
        """
        # Sort rate changes: None (original) first, then by date ascending
        sorted_rates = sorted(
            self.rate_changes,
            key=lambda r: r.effective_date or ""
        )

        applicable_rate = sorted_rates[0].hourly_rate  # Default to original

        for rate_change in sorted_rates:
            if rate_change.effective_date is None or rate_change.effective_date <= date_str:
                applicable_rate = rate_change.hourly_rate
            else:
                break  # Future rate, stop looking

        return applicable_rate

    @property
    def current_rate(self) -> float:
        """Get the current hourly rate (for display purposes)."""
        return self.get_rate_for_date(datetime.now().strftime('%Y-%m-%d'))

    def update(self, project):
        self.name = project.name
        self.client_id = project.client_id
        self.color = project.color
        self.rate_changes = project.rate_changes
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
