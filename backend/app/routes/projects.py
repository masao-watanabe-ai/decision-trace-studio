from fastapi import APIRouter, HTTPException
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.project_service import ProjectService

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _get_service() -> ProjectService:
    return ProjectService(ProjectRepository())


@router.get("", response_model=list[ProjectResponse])
def list_projects() -> list[ProjectResponse]:
    return _get_service().get_all_projects()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str) -> ProjectResponse:
    repo = ProjectRepository()
    project = repo.get_by_id(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id!r} not found")
    return project


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(body: ProjectCreate) -> ProjectResponse:
    return _get_service().create_project(body)
