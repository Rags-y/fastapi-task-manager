from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from routes import router


app = FastAPI(
    title="Task Management API",
    description="A FastAPI project demonstrating CRUD, search, filtering, validation, and HTTP status codes.",
    version="1.0.0"
)


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home():
    return {
        "message": "Task Management API is running"
    }


@app.get("/app")
def dashboard():
    return FileResponse("templates/index.html")


app.include_router(router)