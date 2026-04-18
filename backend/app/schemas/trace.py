from datetime import datetime
from pydantic import BaseModel
from app.schemas.simulation import ComparisonResult, Scenario


class EvaluatedCondition(BaseModel):
    node_id: str
    node_label: str
    condition: str
    matched: bool


class TraceResponse(BaseModel):
    id: str
    project_id: str
    simulation_run_id: str
    scenario: Scenario
    final_action: str
    comparison: ComparisonResult
    matched_node_id: str | None
    evaluated_conditions: list[EvaluatedCondition]
    trace_lines: list[str]
    created_at: datetime
