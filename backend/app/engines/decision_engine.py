from app.schemas.flow import FlowResponse
from app.schemas.simulation import EngineResult, Scenario

_ALLOWED_VARS = frozenset({"category", "vip", "legal_risk", "text"})

# node type → label shown in trace
_TYPE_LABEL = {
    "decision": "DECISION",
    "boundary": "BOUNDARY",
    "human_gate": "HUMAN_GATE",
    "fallback": "FALLBACK",
}


def _eval_condition(condition: str, context: dict) -> tuple[bool, str | None]:
    try:
        result = eval(condition, {"__builtins__": {}}, context)  # noqa: S307
        return bool(result), None
    except Exception as exc:
        return False, f"condition eval failed: {condition!r} → {exc}"


def evaluate(flow: FlowResponse, scenario: Scenario) -> EngineResult:
    context = {
        "category": scenario.category,
        "vip": scenario.vip,
        "legal_risk": scenario.legal_risk,
        "text": scenario.text,
    }

    sorted_nodes = sorted(flow.nodes, key=lambda n: n.priority)

    traversed_nodes: list[str] = []
    triggered_boundaries: list[str] = []
    trace: list[str] = [
        f"input: category={scenario.category!r}, "
        f"legal_risk={scenario.legal_risk}, vip={scenario.vip}",
        "node order (priority): "
        + ", ".join(
            f"{n.id}[{n.type}](p={n.priority})"
            for n in sorted_nodes
            if n.condition
        ),
    ]

    matched_action: str | None = None

    for node in sorted_nodes:
        if not node.condition:
            continue

        traversed_nodes.append(node.id)
        label = node.data.get("label", node.id)
        type_tag = _TYPE_LABEL.get(node.type, node.type.upper())

        trace.append(
            f"node {node.id!r} [{label}] type={type_tag} priority={node.priority}: "
            f"eval {node.condition!r}"
        )

        matched, error = _eval_condition(node.condition, context)

        if error:
            trace.append(f"  [condition_error] {error}")
            continue

        if matched:
            if node.type == "boundary":
                # boundary: blocking — mark as triggered, use node.action
                triggered_boundaries.append(node.id)
                trace.append(
                    f"  → True  [BOUNDARY TRIGGERED] action={node.action!r}"
                )
                matched_action = node.action

            elif node.type == "human_gate":
                # human_gate: always forces human_review regardless of node.action
                triggered_boundaries.append(node.id)
                trace.append(
                    f"  → True  [HUMAN_GATE] forced action='human_review'"
                )
                matched_action = "human_review"

            else:
                # decision / fallback: use node.action as-is
                trace.append(f"  → True  action={node.action!r}")
                matched_action = node.action

            break
        else:
            trace.append("  → False")

    if matched_action is not None:
        final_action = matched_action
    else:
        final_action = "auto_reply"
        trace.append("no condition matched → fallback: auto_reply")

    trace.append(f"final_action={final_action!r}")

    return EngineResult(
        final_action=final_action,
        traversed_nodes=traversed_nodes,
        triggered_boundaries=triggered_boundaries,
        trace=trace,
    )
