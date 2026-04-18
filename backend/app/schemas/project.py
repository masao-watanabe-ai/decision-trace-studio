from pydantic import BaseModel
from datetime import datetime


class ProjectCreate(BaseModel):
    name: str
    template_id: str
    domain_pack_id: str


class ProjectResponse(BaseModel):
    id: str
    name: str
    template_id: str
    domain_pack_id: str
    description: str
    created_at: datetime
