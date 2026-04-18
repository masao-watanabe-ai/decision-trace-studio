from fastapi import APIRouter, HTTPException
from app.repositories.trace_repository import TraceRepository
from app.schemas.trace import TraceResponse
from app.services.trace_service import TraceService

router = APIRouter(tags=["traces"])


def _get_service() -> TraceService:
    return TraceService(TraceRepository())


@router.get(
    "/api/projects/{project_id}/traces",
    response_model=list[TraceResponse],
)
def list_traces(project_id: str) -> list[TraceResponse]:
    return _get_service().get_traces_by_project(project_id)


@router.get(
    "/api/traces/{trace_id}",
    response_model=TraceResponse,
)
def get_trace(trace_id: str) -> TraceResponse:
    try:
        return _get_service().get_trace(trace_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
