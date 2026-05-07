from __future__ import annotations
from .schemas import Workflow

_workflows: dict[str, Workflow] = {}
_runs: dict[str, dict] = {}


def save_workflow(workflow: Workflow) -> None:
    _workflows[workflow.id] = workflow


def get_workflow(workflow_id: str) -> Workflow | None:
    return _workflows.get(workflow_id)


def save_run(run_id: str, data: dict) -> None:
    _runs[run_id] = data


def get_run(run_id: str) -> dict | None:
    return _runs.get(run_id)
