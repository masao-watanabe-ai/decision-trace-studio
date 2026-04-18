from fastapi import APIRouter, HTTPException
from app.repositories.flow_repository import FlowRepository
from app.repositories.simulation_repository import SimulationRepository
from app.repositories.trace_repository import TraceRepository
from app.schemas.comparison import CompareRequest, CompareResponse
from app.schemas.simulation import RunSimulationRequest, Scenario, SimulationRun
from app.services.simulation_service import SimulationService

router = APIRouter(tags=["simulations"])


def _get_service() -> SimulationService:
    return SimulationService(FlowRepository(), SimulationRepository(), TraceRepository())


@router.post(
    "/api/projects/{project_id}/scenarios/generate",
    response_model=list[Scenario],
)
def generate_scenarios(project_id: str) -> list[Scenario]:
    return _get_service().generate_scenarios(project_id)


@router.post(
    "/api/projects/{project_id}/simulations/run",
    response_model=SimulationRun,
    status_code=201,
)
def run_simulation(project_id: str, body: RunSimulationRequest) -> SimulationRun:
    return _get_service().run_simulation(project_id, body.scenarios)


@router.get(
    "/api/simulations/{simulation_id}/results",
    response_model=SimulationRun,
)
def get_results(simulation_id: str) -> SimulationRun:
    try:
        return _get_service().get_results(simulation_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/api/projects/{project_id}/simulations/compare",
    response_model=CompareResponse,
    status_code=201,
)
def compare_simulations(project_id: str, body: CompareRequest) -> CompareResponse:
    return _get_service().compare(project_id, body)
