from __future__ import annotations
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class WorkflowNode(BaseModel):
    id: str
    label: str
    status: str
    output: str | None = None


class Workflow(BaseModel):
    id: str
    nodes: list[WorkflowNode]
    createdAt: str


class StepLog(BaseModel):
    step: str
    message: str
    timestamp: str


class ChatResponse(BaseModel):
    answer: str
    workflow: Workflow
    run_id: str
    logs: list[StepLog]


class WorkflowCompileRequest(BaseModel):
    prompt: str


class WorkflowRunRequest(BaseModel):
    workflow_id: str
