from app.repositories.trace_repository import TraceRepository
from app.schemas.trace import TraceResponse


class TraceService:
    def __init__(self, repository: TraceRepository) -> None:
        self.repository = repository

    def get_traces_by_project(self, project_id: str) -> list[TraceResponse]:
        return self.repository.list_by_project(project_id)

    def get_trace(self, trace_id: str) -> TraceResponse:
        return self.repository.get(trace_id)
