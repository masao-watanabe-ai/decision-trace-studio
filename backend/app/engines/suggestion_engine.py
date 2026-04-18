from collections import Counter
from uuid import uuid4

from app.schemas.flow import FlowResponse
from app.schemas.suggestion import Suggestion
from app.schemas.trace import TraceResponse


def _has_condition_error(trace: TraceResponse) -> bool:
    return any("[condition_error]" in line for line in trace.trace_lines)


def _always_matched_node(traces: list[TraceResponse]) -> str | None:
    """Return node_id that matched in every trace (except fallback-only)."""
    counts: Counter[str] = Counter()
    for t in traces:
        if t.matched_node_id:
            counts[t.matched_node_id] += 1
    if not counts:
        return None
    most_common_id, freq = counts.most_common(1)[0]
    if freq == len(traces):
        return most_common_id
    return None


def analyze(
    project_id: str,
    flow: FlowResponse,
    traces: list[TraceResponse],
) -> list[Suggestion]:
    if not traces:
        return []

    suggestions: list[Suggestion] = []
    node_map = {n.id: n for n in flow.nodes}

    # ── boundary_add: uncovered scenarios (no node matched) ──
    no_match_traces = [t for t in traces if t.matched_node_id is None]
    if no_match_traces:
        sample = no_match_traces[0].scenario
        suggestions.append(
            Suggestion(
                id=str(uuid4()),
                project_id=project_id,
                type="boundary_add",
                target_node_id=None,
                reason=(
                    f"{len(no_match_traces)} シナリオがどの条件にもマッチせず "
                    f"auto_reply にフォールバックしています "
                    f"(例: category={sample.category!r})"
                ),
                impact="boundary ノードを追加することで意図しない auto_reply を削減できます",
                proposed_node_type="boundary",
                proposed_condition=f"category == '{sample.category}'",
                proposed_action="human_review",
                proposed_priority=50,
            )
        )

    # ── condition_split: node with condition errors ──
    error_node_ids: set[str] = set()
    for t in traces:
        if _has_condition_error(t):
            for ec in t.evaluated_conditions:
                if "condition eval failed" in " ".join(t.trace_lines):
                    error_node_ids.add(ec.node_id)
    for node_id in error_node_ids:
        node = node_map.get(node_id)
        if node:
            suggestions.append(
                Suggestion(
                    id=str(uuid4()),
                    project_id=project_id,
                    type="condition_split",
                    target_node_id=node_id,
                    reason=(
                        f"ノード {node_id!r} の条件式 {node.condition!r} が "
                        f"評価エラーを起こしています"
                    ),
                    impact="条件式を修正または分割することでエラーを解消できます",
                    proposed_condition=node.condition,
                )
            )

    # ── priority_adjust: one node monopolises all matches ──
    dominant_id = _always_matched_node(traces)
    if dominant_id and len(flow.nodes) > 1:
        node = node_map.get(dominant_id)
        if node:
            # Suggest a higher priority (lower number) for diversification review
            other_priorities = [n.priority for n in flow.nodes if n.id != dominant_id]
            min_other = min(other_priorities) if other_priorities else node.priority
            if node.priority > min_other:
                suggestions.append(
                    Suggestion(
                        id=str(uuid4()),
                        project_id=project_id,
                        type="priority_adjust",
                        target_node_id=dominant_id,
                        reason=(
                            f"ノード {dominant_id!r} が全シナリオでマッチしています。"
                            f"他のノードが評価される前にこのノードが捕捉している可能性があります"
                        ),
                        impact="priority を下げることで他のノードが先に評価されるようになります",
                        proposed_priority=min_other - 5,
                    )
                )

    # ── priority_adjust: mismatch rate high on a specific node ──
    mismatch_by_node: Counter[str] = Counter()
    for t in traces:
        if t.comparison.mismatch and t.matched_node_id:
            mismatch_by_node[t.matched_node_id] += 1
    for node_id, count in mismatch_by_node.most_common(1):
        if count >= 2 and node_id not in {s.target_node_id for s in suggestions}:
            node = node_map.get(node_id)
            if node:
                suggestions.append(
                    Suggestion(
                        id=str(uuid4()),
                        project_id=project_id,
                        type="priority_adjust",
                        target_node_id=node_id,
                        reason=(
                            f"ノード {node_id!r} でマッチしたシナリオのうち {count} 件が"
                            f" expected_action と不一致です"
                        ),
                        impact="優先度を調整し、より具体的な条件ノードを先に評価させることを検討してください",
                        proposed_priority=node.priority + 10,
                    )
                )

    return suggestions
