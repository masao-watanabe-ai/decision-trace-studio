from app.repositories.flow_repository import FlowRepository
from app.schemas.flow import FlowResponse, FlowUpdate


class FlowService:
    def __init__(self, repository: FlowRepository) -> None:
        self.repository = repository

    def get_current_flow(self, project_id: str) -> FlowResponse:
        return self.repository.get_current_by_project(project_id)

    def update_flow(self, flow_id: str, data: FlowUpdate) -> FlowResponse:
        return self.repository.update(flow_id, data)
