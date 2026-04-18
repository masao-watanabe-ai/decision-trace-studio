from pydantic import BaseModel


class Scenario(BaseModel):
    id: str
    text: str
    category: str
    vip: bool
    legal_risk: bool
    expected_action: str


class RunSimulationRequest(BaseModel):
    scenarios: list[Scenario]


class EngineResult(BaseModel):
    final_action: str
    traversed_nodes: list[str]
    triggered_boundaries: list[str]
    trace: list[str]


class ComparisonResult(BaseModel):
    success: bool
    mismatch: bool


class SimulationResult(BaseModel):
    scenario: Scenario
    engine_result: EngineResult
    comparison: ComparisonResult
    trace_id: str | None = None


class SimulationRun(BaseModel):
    id: str
    project_id: str
    results: list[SimulationResult]
