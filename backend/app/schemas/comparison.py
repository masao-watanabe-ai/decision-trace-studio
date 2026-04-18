from pydantic import BaseModel
from app.schemas.flow import FlowUpdate
from app.schemas.simulation import Scenario, SimulationResult


class CompareRequest(BaseModel):
    scenarios: list[Scenario]
    flow_before: FlowUpdate
    flow_after: FlowUpdate


class ScenarioDiff(BaseModel):
    scenario_id: str
    scenario_text: str
    action_before: str
    action_after: str
    changed: bool
    trace_before_id: str | None = None
    trace_after_id: str | None = None


class CompareResponse(BaseModel):
    id: str
    project_id: str
    before_results: list[SimulationResult]
    after_results: list[SimulationResult]
    diff: list[ScenarioDiff]
