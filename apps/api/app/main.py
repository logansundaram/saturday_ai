from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    ChatRequest,
    ChatResponse,
    WorkflowCompileRequest,
    WorkflowRunRequest,
)
from .workflow import compile_workflow, run_workflow
from . import store

app = FastAPI(title="Saturday API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    workflow = compile_workflow(req.message)
    run_id, answer, logs = run_workflow(workflow, req.message)
    return ChatResponse(answer=answer, workflow=workflow, run_id=run_id, logs=logs)


@app.post("/workflow/compile")
def workflow_compile(req: WorkflowCompileRequest):
    return compile_workflow(req.prompt)


@app.post("/workflow/run")
def workflow_run(req: WorkflowRunRequest):
    workflow = store.get_workflow(req.workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    run_id, answer, logs = run_workflow(workflow, "")
    return {"run_id": run_id, "answer": answer, "logs": [l.model_dump() for l in logs]}


@app.get("/workflow/{workflow_id}")
def get_workflow(workflow_id: str):
    workflow = store.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@app.get("/runs/{run_id}/logs")
def get_run_logs(run_id: str):
    run = store.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run.get("logs", [])
