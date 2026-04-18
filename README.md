# Decision Trace Studio

**意思決定を設計して、実行して、比較して、改善し続けるための Studio。**

---

## 🚧 Early Access

This is an early-stage prototype of Decision Trace Studio.

We are exploring a new paradigm:  
**AI as a decision system, not just a prediction engine.**

This project focuses on making decisions:
- explicit
- testable
- improvable

If you're interested in using this in real environments,  
feel free to reach out or open a discussion.

If you're interested in using this in real environments,  
feel free to reach out or open a discussion.

👉 Learn more: https://deus-ex-machina-ism.com

---

AI はシグナルを出す存在です。でも現場では、そのシグナルを受けて「最終的に何をするか」——つまり **Decision** を下す必要があります。Decision Trace Studio は、その Decision の部分を人間が設計・管理・改善するためのツールです。AIの精度を上げるツールではなく、**意思決定そのものを設計・運用するインフラ**です。

---

## できること

### Design — フローを設計する

判断ロジックをノードとエッジで視覚的に設計します。ノードは4種類。通常の判断をおこなう **Decision**、リスク境界を捉える **Boundary**、必ず人間が判断する **Human Gate**、どの条件にも当てはまらない **Fallback**。条件・アクション・優先度を各ノードに設定でき、変更のたびにバージョンが記録されます。

### Simulate — シナリオを実行する

テストシナリオを自動生成してフロー全体を実行検証します。各シナリオがどのノードを通過してどのアクションに至ったかがすべて記録されます。「このインプットでこの判断になるのか」を事前に確認できます。

### Compare — 変更の影響を比較する

フローを変更する前と後のシミュレーション結果を並べて比較します。どのシナリオのアクションが変わったか、変わっていないかが一目でわかります。改善が意図した効果をもたらしているか、予期しない副作用がないかを、本番反映前に定量的に確認できます。

### Trace — 判断の根拠を追う

各シナリオのノード評価ステップを時系列で追跡します。「なぜこの判断になったのか」を後から再現できる状態にします。説明責任が求められる業務での監査や、フロー改善のデバッグに使います。

### Improve — 提案を生成して反映する

シミュレーション結果を分析し、境界追加・条件分割・優先度調整などの改善提案を自動生成します。提案内容を確認して承認すると、フローにそのまま反映されます。その後 Simulate → Compare で改善効果を数値で確認できます。

---

## Call Center デモシナリオ

初期状態のプロジェクトには、**コールセンター対応フロー**のデモが組み込まれています。

| ノード | 種別 | 役割 |
|---|---|---|
| VIP Fast Track | Decision | VIPフラグが立っているお客様を優先対応 |
| Refund+Legal Risk | Boundary | 一定金額以上の返金 + 法的言及があるケースをエスカレーション |
| Complaint Gate | Human Gate | クレーム区分のケースを人間にエスカレーション |
| Default | Fallback | 上記いずれにも該当しない場合のデフォルト対応 |

このフローを出発点として、シミュレーション → Compare → Improve の一連のサイクルを体験できます。

---

## Guided Demo の使い方

Studio を開いたら、ヘッダー右上の **`▶ Demo`** ボタンを押してください。7ステップのウォークスルーが画面下部に表示され、各ステップで操作すべきタブに自動で切り替わります。

```
Step 1  Flow を見る        → Design タブ
Step 2  シナリオ生成        → Simulate タブ
Step 3  シミュレーション実行  → Simulate タブ
Step 4  Compare を見る     → Compare タブ
Step 5  提案生成           → Improve タブ
Step 6  承認して Flow に反映 → Improve タブ
Step 7  再実行して変化を見る  → Simulate タブ
```

ステップ番号をクリックすると任意のステップに移動できます。デモを終了するには「完了」または「✕」を押してください。

---

## デモを見る推奨順序

1. **Design タブ** でノード構成を確認する
2. **Simulate タブ** でシナリオ生成 → 全件実行する
3. **Trace** で任意シナリオの評価ステップを開く
4. **Compare タブ** で Before / After を確認する（初回は差分なし）
5. **Improve タブ** で改善提案を生成 → 承認して Flow に反映する
6. **Simulate タブ** で再実行する
7. **Compare タブ** で改善前後の差分を確認する

---

## 詳細なデモ台本

口頭でのプレゼン用に 1分版・3分版の台本を用意しています。

→ [docs/demo-script-ja.md](docs/demo-script-ja.md)

---

## セットアップ

### バックエンド

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Python 3.11 以上が必要です（`backend/.python-version` で指定）。

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。バックエンドは `http://localhost:8000` で起動していることを確認してください。

### Docker を使う場合

```bash
docker compose up
```

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 18 + TypeScript + Vite |
| UIライブラリ | Tailwind CSS + @xyflow/react v12 |
| 状態管理 | TanStack Query v5 + Zustand v5 |
| バックエンド | FastAPI + Pydantic v2 |
| データ永続化 | インメモリ（開発用） |

---

## Learn More

For more details about Decision Trace Model and decision systems:

👉 https://deus-ex-machina-ism.com
