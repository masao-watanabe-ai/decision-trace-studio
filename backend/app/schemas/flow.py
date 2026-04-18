from typing import Any, Literal
from pydantic import BaseModel

NodeType = Literal["decision", "boundary", "human_gate", "fallback"]


class FlowNode(BaseModel):
    id: str
    type: NodeType
    data: dict[str, Any]
    position: dict[str, float]
    condition: str = ""
    action: str = ""
    priority: int = 0


class FlowEdge(BaseModel):
    id: str
    source: str
    target: str


class FlowResponse(BaseModel):
    id: str
    project_id: str
    nodes: list[FlowNode]
    edges: list[FlowEdge]
    version: int = 1


class FlowUpdate(BaseModel):
    nodes: list[FlowNode]
    edges: list[FlowEdge]
