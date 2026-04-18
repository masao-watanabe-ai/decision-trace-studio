from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse


class ProjectService:
    def __init__(self, repository: ProjectRepository) -> None:
        self.repository = repository

    def get_all_projects(self) -> list[ProjectResponse]:
        return self.repository.list_all()

    def create_project(self, data: ProjectCreate) -> ProjectResponse:
        return self.repository.create(data)
