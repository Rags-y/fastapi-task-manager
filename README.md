# Task Management API

A simple Task Management REST API built with FastAPI.

This project demonstrates basic FastAPI functionality including CRUD operations, search, filtering, Pydantic validation, HTTP status codes, and automatic API documentation.

## Features

- Create tasks
- Get all tasks
- Get a task by ID
- Update tasks
- Delete tasks
- Search tasks by keyword
- Filter tasks by status
- Filter tasks by priority
- Request validation using Pydantic
- HTTP error handling
- Automatic Swagger API documentation

## Technologies

- Python
- FastAPI
- Pydantic
- Uvicorn

## Project Structure

```text
fastapi-task-manager/
│
├── main.py
├── models.py
├── routes.py
├── requirements.txt
├── README.md
└── venv/
```

## Setup
1. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1
2. Install dependencies
pip install -r requirements.txt
3. Run the application
uvicorn main:app --reload

The API will run at:

http://127.0.0.1:8000
API Documentation

Swagger UI:

http://127.0.0.1:8000/docs

ReDoc:

http://127.0.0.1:8000/redoc

API Endpoints

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/`                | Check API status |
| POST   | `/tasks`           | Create a task    |
| GET    | `/tasks`           | Get all tasks    |
| GET    | `/tasks/{task_id}` | Get a task by ID |
| GET    | `/tasks/search`    | Search tasks     |
| PUT    | `/tasks/{task_id}` | Update a task    |
| DELETE | `/tasks/{task_id}` | Delete a task    |

Filtering

Get completed tasks:

GET /tasks?status=completed

Get high-priority tasks:

GET /tasks?priority=high

Combine filters:

GET /tasks?status=pending&priority=high
Example Task
{
  "title": "Learn FastAPI",
  "description": "Build a Task Management API",
  "priority": "high",
  "status": "pending"
}

Validation

The API accepts these priority values:

low
medium
high

The API accepts these status values:

pending
in-progress
completed

Invalid values are rejected by FastAPI/Pydantic.

Current Storage

The project currently uses an in-memory Python dictionary for task storage.

Therefore, task data is reset whenever the application restarts.

## Future Improvements

Add SQLite/PostgreSQL database
Add SQLAlchemy
Add authentication
Add pagination
Add automated tests
Add Docker support

## Author
Raghav Kumar
