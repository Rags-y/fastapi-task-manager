from pydantic import BaseModel, Field


class Task(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    priority: str = Field(..., pattern="^(low|medium|high)$")
    status: str = Field(
        default="pending",
        pattern="^(pending|in-progress|completed)$"
    )