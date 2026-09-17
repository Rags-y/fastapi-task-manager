from fastapi import FastAPI
from routes import router


app = FastAPI(
    title="Task Management API",
    description="A FastAPI project demonstrating CRUD, search, filtering, validation, and HTTP status codes.",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Task Management API is running"
    }


app.include_router(router)