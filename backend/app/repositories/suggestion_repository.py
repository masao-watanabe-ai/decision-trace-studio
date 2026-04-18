from app.schemas.suggestion import Suggestion

_store: dict[str, Suggestion] = {}
_by_project: dict[str, list[str]] = {}


class SuggestionRepository:
    def save_many(self, suggestions: list[Suggestion]) -> None:
        for s in suggestions:
            _store[s.id] = s
            _by_project.setdefault(s.project_id, [])
            if s.id not in _by_project[s.project_id]:
                _by_project[s.project_id].append(s.id)

    def list_by_project(self, project_id: str) -> list[Suggestion]:
        return [_store[sid] for sid in _by_project.get(project_id, []) if sid in _store]

    def get(self, suggestion_id: str) -> Suggestion:
        if suggestion_id not in _store:
            raise KeyError(f"Suggestion {suggestion_id!r} not found")
        return _store[suggestion_id]

    def update_status(
        self,
        suggestion_id: str,
        status: str,
        applied_to_flow: bool = False,
    ) -> Suggestion:
        s = self.get(suggestion_id)
        updated = s.model_copy(update={"status": status, "applied_to_flow": applied_to_flow})
        _store[suggestion_id] = updated
        return updated
