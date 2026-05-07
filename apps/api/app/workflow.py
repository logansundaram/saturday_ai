from __future__ import annotations
import uuid
from datetime import datetime, timezone
from .schemas import Workflow, WorkflowNode, StepLog
from . import store

# TODO: Replace with LangGraph StateGraph definition
STEP_NAMES = ["plan", "retrieve", "draft", "finalize"]


def compile_workflow(prompt: str) -> Workflow:
    workflow_id = str(uuid.uuid4())
    nodes = [
        WorkflowNode(
            id=f"{workflow_id}:{step}",
            label=step,
            status="pending",
        )
        for step in STEP_NAMES
    ]
    workflow = Workflow(
        id=workflow_id,
        nodes=nodes,
        createdAt=datetime.now(timezone.utc).isoformat(),
    )
    store.save_workflow(workflow)
    return workflow


def run_workflow(workflow: Workflow, prompt: str) -> tuple[str, str, list[StepLog]]:
    run_id = str(uuid.uuid4())
    logs: list[StepLog] = []

    # TODO: Replace mock_outputs with real Ollama inference calls
    mock_outputs: dict[str, str] = {
        "plan": f"Analyzing request: {prompt[:60]}{'...' if len(prompt) > 60 else ''}",
        "retrieve": "Retrieved 3 relevant context chunks from local store",  # TODO: wire RAG / local vector store
        "draft": "Drafted response based on retrieved context",
        "finalize": "Validated and formatted final output",
    }

    for node in workflow.nodes:
        node.status = "done"
        node.output = mock_outputs.get(node.label, "")
        ts = datetime.now(timezone.utc).isoformat()
        logs.append(
            StepLog(
                step=node.label,
                message=f"[{node.label}] {node.output}",
                timestamp=ts,
            )
        )

    # TODO: Return real answer from Ollama model
    answer = f"[Mock response] You asked: {prompt}"

    store.save_run(run_id, {"workflow_id": workflow.id, "logs": [l.model_dump() for l in logs]})
    return run_id, answer, logs
