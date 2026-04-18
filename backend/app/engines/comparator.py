from app.schemas.simulation import ComparisonResult


def compare(expected_action: str, final_action: str) -> ComparisonResult:
    success = expected_action == final_action
    return ComparisonResult(success=success, mismatch=not success)
