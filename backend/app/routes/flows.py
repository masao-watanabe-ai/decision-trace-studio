from fastapi import APIRouter, HTTPException
from app.repositories.flow_repository import FlowRepository
from app.schemas.flow import FlowResponse, FlowUpdate
from app.services.flow_service import FlowService

router = APIRouter(tags=["flows"])


def _get_service() -> FlowService:
    return FlowService(FlowRepository())


@router.get("/api/projects/{project_id}/flows/current", response_model=FlowResponse)
def get_current_flow(project_id: str) -> FlowResponse:
    return _get_service().get_current_flow(project_id)


@router.put("/api/flows/{flow_id}", response_model=FlowResponse)
def update_flow(flow_id: str, body: FlowUpdate) -> FlowResponse:
    try:
        return _get_service().update_flow(flow_id, body)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
