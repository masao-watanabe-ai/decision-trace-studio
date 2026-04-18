from uuid import uuid4
from app.schemas.flow import FlowEdge, FlowNode, FlowResponse, FlowUpdate


def _make_initial_flow(project_id: str) -> FlowResponse:
    return FlowResponse(
        id=str(uuid4()),
        project_id=project_id,
        version=1,
        nodes=[
            FlowNode(
                id="node-1",
                type="decision",
                data={"label": "VIP Fast Track"},
                position={"x": 200, "y": 50},
                condition="vip == True and legal_risk == False",
                action="auto_reply",
                priority=5,
            ),
            FlowNode(
                id="node-2",
                type="boundary",
                data={"label": "Refund + Legal Risk"},
                position={"x": 200, "y": 175},
                condition="category == 'refund' and legal_risk == True",
                action="human_review",
                priority=10,
            ),
            FlowNode(
                id="node-3",
                type="human_gate",
                data={"label": "Complaint Gate"},
                position={"x": 200, "y": 300},
                condition="category == 'complaint'",
                action="human_review",
                priority=20,
            ),
            FlowNode(
                id="node-4",
                type="fallback",
                data={"label": "Default"},
                position={"x": 200, "y": 425},
                condition="True",
                action="auto_reply",
                priority=999,
            ),
        ],
        edges=[
            FlowEdge(id="edge-1", source="node-1", target="node-2"),
            FlowEdge(id="edge-2", source="node-2", target="node-3"),
            FlowEdge(id="edge-3", source="node-3", target="node-4"),
        ],
    )


# project_id → FlowResponse
_by_project: dict[str, FlowResponse] = {}
# flow_id → FlowResponse
_by_id: dict[str, FlowResponse] = {}


class FlowRepository:
    def get_current_by_project(self, project_id: str) -> FlowResponse:
        if project_id not in _by_project:
            flow = _make_initial_flow(project_id)
            _by_project[project_id] = flow
            _by_id[flow.id] = flow
        return _by_project[project_id]

    def update(self, flow_id: str, data: FlowUpdate) -> FlowResponse:
        if flow_id not in _by_id:
            raise KeyError(f"Flow {flow_id!r} not found")
        existing = _by_id[flow_id]
        updated = FlowResponse(
            id=existing.id,
            project_id=existing.project_id,
            version=existing.version + 1,
            nodes=data.nodes,
            edges=data.edges,
        )
        _by_id[flow_id] = updated
        _by_project[existing.project_id] = updated
        return updated
