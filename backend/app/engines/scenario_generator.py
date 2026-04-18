from uuid import uuid4
from app.schemas.simulation import Scenario


def generate(project_id: str) -> list[Scenario]:  # noqa: ARG001
    return [
        Scenario(
            id=str(uuid4()),
            text="返金をお願いしたいのですが、クレジット会社に相談すると言っています",
            category="refund",
            vip=False,
            legal_risk=True,
            expected_action="human_review",
        ),
        Scenario(
            id=str(uuid4()),
            text="先日購入した商品を返金してほしいのですが手続きを教えてください",
            category="refund",
            vip=False,
            legal_risk=False,
            expected_action="auto_reply",
        ),
        Scenario(
            id=str(uuid4()),
            text="対応が遅すぎて非常に不満です。責任者を呼んでください",
            category="complaint",
            vip=True,
            legal_risk=False,
            expected_action="human_review",
        ),
        Scenario(
            id=str(uuid4()),
            text="営業時間は何時から何時までですか？",
            category="faq",
            vip=False,
            legal_risk=False,
            expected_action="auto_reply",
        ),
        Scenario(
            id=str(uuid4()),
            text="パスワードのリセット方法を教えてください",
            category="faq",
            vip=False,
            legal_risk=False,
            expected_action="auto_reply",
        ),
    ]
