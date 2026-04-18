from datetime import datetime, timezone
from uuid import uuid4
from app.engines import comparator, decision_engine, scenario_generator
from app.repositories.flow_repository import FlowRepository
from app.repositories.simulation_repository import SimulationRepository
from app.repositories.trace_repository import TraceRepository
from app.schemas.comparison import CompareResponse, CompareRequest, ScenarioDiff
from app.schemas.flow import FlowResponse, FlowUpdate
from app.schemas.simulation import (
    ComparisonResult,
    EngineResult,
    Scenario,
    SimulationResult,
    SimulationRun,
)
from app.schemas.trace import EvaluatedCondition, TraceResponse


def _build_trace(
    project_id: str,
    sim_run_id: str,
    flow: FlowResponse,
    scenario: Scenario,
    engine_result: EngineResult,
    comparison: ComparisonResult,
) -> TraceResponse:
    node_map = {node.id: node for node in flow.nodes}
    evaluated_conditions = [
        EvaluatedCondition(
            node_id=nid,
            node_label=str(node_map[nid].data.get("label", nid)) if nid in node_map else nid,
            condition=node_map[nid].condition if nid in node_map else "",
            matched=nid in engine_result.triggered_boundaries,
        )
        for nid in engine_result.traversed_nodes
    ]
    return TraceResponse(
        id=str(uuid4()),
        project_id=project_id,
        simulation_run_id=sim_run_id,
        scenario=scenario,
        final_action=engine_result.final_action,
        comparison=comparison,
        matched_node_id=engine_result.triggered_boundaries[0]
        if engine_result.triggered_boundaries
        else None,
        evaluated_conditions=evaluated_conditions,
        trace_lines=engine_result.trace,
        created_at=datetime.now(timezone.utc),
    )


def _run_on_flow(
    project_id: str,
    run_id: str,
    flow: FlowResponse,
    scenarios: list[Scenario],
    trace_repo: TraceRepository,
) -> list[SimulationResult]:
    results: list[SimulationResult] = []
    for scenario in scenarios:
        engine_result = decision_engine.evaluate(flow, scenario)
        comparison = comparator.compare(scenario.expected_action, engine_result.final_action)
        trace = _build_trace(project_id, run_id, flow, scenario, engine_result, comparison)
        trace_repo.save(trace)
        results.append(
            SimulationResult(
                scenario=scenario,
                engine_result=engine_result,
                comparison=comparison,
                trace_id=trace.id,
            )
        )
    return results


def _flow_response_from_update(project_id: str, run_id: str, data: FlowUpdate) -> FlowResponse:
    return FlowResponse(
        id=f"snapshot-{run_id}",
        project_id=project_id,
        nodes=data.nodes,
        edges=data.edges,
    )


class SimulationService:
    def __init__(
        self,
        flow_repo: FlowRepository,
        sim_repo: SimulationRepository,
        trace_repo: TraceRepository,
    ) -> None:
        self.flow_repo = flow_repo
        self.sim_repo = sim_repo
        self.trace_repo = trace_repo

    def generate_scenarios(self, project_id: str) -> list[Scenario]:
        return scenario_generator.generate(project_id)

    def run_simulation(self, project_id: str, scenarios: list[Scenario]) -> SimulationRun:
        run_id = str(uuid4())
        flow = self.flow_repo.get_current_by_project(project_id)
        results = _run_on_flow(project_id, run_id, flow, scenarios, self.trace_repo)
        run = SimulationRun(id=run_id, project_id=project_id, results=results)
        self.sim_repo.save(run)
        return run

    def get_results(self, simulation_id: str) -> SimulationRun:
        return self.sim_repo.get(simulation_id)

    def compare(self, project_id: str, request: CompareRequest) -> CompareResponse:
        run_id = str(uuid4())

        flow_before = _flow_response_from_update(
            project_id, f"{run_id}-before", request.flow_before
        )
        flow_after = _flow_response_from_update(
            project_id, f"{run_id}-after", request.flow_after
        )

        before_results = _run_on_flow(
            project_id, f"{run_id}-before", flow_before, request.scenarios, self.trace_repo
        )
        after_results = _run_on_flow(
            project_id, f"{run_id}-after", flow_after, request.scenarios, self.trace_repo
        )

        diff: list[ScenarioDiff] = [
            ScenarioDiff(
                scenario_id=b.scenario.id,
                scenario_text=b.scenario.text,
                action_before=b.engine_result.final_action,
                action_after=a.engine_result.final_action,
                changed=b.engine_result.final_action != a.engine_result.final_action,
                trace_before_id=b.trace_id,
                trace_after_id=a.trace_id,
            )
            for b, a in zip(before_results, after_results)
        ]

        return CompareResponse(
            id=run_id,
            project_id=project_id,
            before_results=before_results,
            after_results=after_results,
            diff=diff,
        )
