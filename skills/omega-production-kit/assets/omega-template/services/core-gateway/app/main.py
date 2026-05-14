from datetime import UTC, datetime
from uuid import uuid4

from fastapi import FastAPI
from pydantic import BaseModel, Field


class TaskRequest(BaseModel):
    command: str = Field(min_length=1)
    priority: int = Field(default=5, ge=0, le=10)


app = FastAPI(title="Omega Core Gateway", version="0.1.0")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "core-gateway"}


@app.post("/tasks")
def create_task(request: TaskRequest) -> dict[str, object]:
    task_id = str(uuid4())
    event = {
        "event_id": str(uuid4()),
        "timestamp": datetime.now(UTC).isoformat(),
        "source_node": "core-gateway",
        "target_node": "brain-engine",
        "event_type": "task.request",
        "priority": request.priority,
        "trace_id": task_id,
        "schema_version": "1.0.0",
        "payload": {"task_id": task_id, "command": request.command},
    }
    return {"task_id": task_id, "status": "accepted", "event": event}
