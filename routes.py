from fastapi import APIRouter, HTTPException, status
from models import Task


router = APIRouter()

tasks = {}
next_task_id = 1


@router.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(task: Task):
    global next_task_id

    task_id = next_task_id

    tasks[task_id] = {
        "id": task_id,
        **task.model_dump()
    }

    next_task_id += 1

    return {
        "message": "Task created successfully",
        "task": tasks[task_id]
    }


@router.get("/tasks")
def get_tasks(
    status: str | None = None,
    priority: str | None = None
):
    results = list(tasks.values())

    if status:
        results = [
            task for task in results
            if task["status"].lower() == status.lower()
        ]

    if priority:
        results = [
            task for task in results
            if task["priority"].lower() == priority.lower()
        ]

    return {
        "count": len(results),
        "tasks": results
    }


@router.get("/tasks/search")
def search_tasks(keyword: str):
    results = []

    for task in tasks.values():
        if (
            keyword.lower() in task["title"].lower()
            or keyword.lower() in task["description"].lower()
        ):
            results.append(task)

    return {
        "keyword": keyword,
        "results": results
    }


@router.get("/tasks/{task_id}")
def get_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "task": tasks[task_id]
    }


@router.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    if task_id not in tasks:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    tasks[task_id] = {
        "id": task_id,
        **task.model_dump()
    }

    return {
        "message": "Task updated successfully",
        "task": tasks[task_id]
    }


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    deleted_task = tasks.pop(task_id)

    return {
        "message": "Task deleted successfully",
        "task": deleted_task
    }