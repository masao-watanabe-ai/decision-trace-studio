from typing import Literal
from pydantic import BaseModel

from app.schemas.flow import NodeType

SuggestionType = Literal["boundary_add", "condition_split", "priority_adjust"]
SuggestionStatus = Literal["pending", "accepted", "rejected"]


class Suggestion(BaseModel):
    id: str
    project_id: str
    type: SuggestionType
    target_node_id: str | None
    reason: str
    impact: str
    proposed_node_type: NodeType | None = None
    proposed_condition: str | None = None
    proposed_action: str | None = None
    proposed_priority: int | None = None
    status: SuggestionStatus = "pending"
    applied_to_flow: bool = False


class SuggestionStatusUpdate(BaseModel):
    status: SuggestionStatus
