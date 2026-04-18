from datetime import datetime, timezone
from uuid import uuid4
from app.schemas.project import ProjectCreate, ProjectResponse

_store: list[ProjectResponse] = [
    ProjectResponse(
        id="1",
        name="Project Alpha",
        template_id="template-basic",
        domain_pack_id="domain-strategy",
        description="意思決定プロセスのトレースを行う最初のプロジェクト",
        created_at=datetime(2024, 1, 15),
    ),
    ProjectResponse(
        id="2",
        name="Project Beta",
        template_id="template-advanced",
        domain_pack_id="domain-ops",
        description="チームの合意形成ロジックを可視化するプロジェクト",
        created_at=datetime(2024, 3, 10),
    ),
    ProjectResponse(
        id="3",
        name="Project Gamma",
        template_id="template-basic",
        domain_pack_id="domain-product",
        description="戦略オプションの比較・評価フレームワーク",
        created_at=datetime(2024, 6, 1),
    ),
]


class ProjectRepository:
    def list_all(self) -> list[ProjectResponse]:
        return list(_store)

    def get_by_id(self, project_id: str) -> ProjectResponse | None:
        return next((p for p in _store if p.id == project_id), None)

    def create(self, data: ProjectCreate) -> ProjectResponse:
        project = ProjectResponse(
            id=str(uuid4()),
            name=data.name,
            template_id=data.template_id,
            domain_pack_id=data.domain_pack_id,
            description="",
            created_at=datetime.now(timezone.utc),
        )
        _store.append(project)
        return project
