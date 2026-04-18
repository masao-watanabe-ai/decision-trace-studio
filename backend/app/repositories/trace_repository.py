from app.schemas.trace import TraceResponse

_store: dict[str, TraceResponse] = {}
_by_project: dict[str, list[str]] = {}


class TraceRepository:
    def save(self, trace: TraceResponse) -> None:
        _store[trace.id] = trace
        _by_project.setdefault(trace.project_id, []).append(trace.id)

    def list_by_project(self, project_id: str) -> list[TraceResponse]:
        return [_store[tid] for tid in _by_project.get(project_id, []) if tid in _store]

    def get(self, trace_id: str) -> TraceResponse:
        if trace_id not in _store:
            raise KeyError(f"Trace {trace_id!r} not found")
        return _store[trace_id]
