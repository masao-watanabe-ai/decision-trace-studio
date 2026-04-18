import { useStudioStore } from '../../store/studioStore'

// ─── Step definitions ─────────────────────────────────────────────────────────

const DEMO_STEPS: { title: string; tab: string | null; description: string }[] = [
  {
    title: 'Flow を見る',
    tab: 'flow',
    description:
      'Design タブに Call Center フローが表示されています。VIP Fast Track / Refund+Legal Risk / Complaint Gate / Default の4ノードで構成されています。',
  },
  {
    title: 'シナリオ生成',
    tab: 'simulate',
    description:
      'Simulate タブで「シナリオ生成」を押してください。お客様からの問い合わせパターン（VIP、法的リスク、クレーム、通常）が自動生成されます。',
  },
  {
    title: 'シミュレーション実行',
    tab: 'simulate',
    description:
      '「全シナリオ実行」を押すと各シナリオがフローを走行します。各行の「Trace」リンクで評価ステップを詳細確認できます。',
  },
  {
    title: 'Compare を見る',
    tab: 'compare',
    description:
      'Compare タブで Before / After のシナリオ結果を並べて比較できます。まだ変更がないため差分はありませんが、改善後に確認します。',
  },
  {
    title: '提案生成',
    tab: 'improve',
    description:
      'Improve タブで「改善提案を生成」を押してください。シミュレーション結果を分析し、境界条件追加や優先度調整などの改善案が表示されます。',
  },
  {
    title: '承認して Flow に反映',
    tab: 'improve',
    description:
      '提案の「承認 & Flow 反映」ボタンを押すと Flow に即反映されます。Design タブに戻るとノードが追加・変更されているのを確認できます。',
  },
  {
    title: '再実行して変化を見る',
    tab: 'simulate',
    description:
      '再度「全シナリオ実行」を押してください。改善後の結果と Compare で差分比較することで、フロー変更の影響を定量的に確認できます。',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function GuidedDemoPanel({ onTabSwitch }: { onTabSwitch: (tab: string) => void }) {
  const { demoStep, setDemoStep } = useStudioStore()

  if (demoStep === null) return null

  const current = DEMO_STEPS[demoStep]
  const isFirst = demoStep === 0
  const isLast = demoStep === DEMO_STEPS.length - 1

  function goTo(next: number) {
    const tab = DEMO_STEPS[next].tab
    setDemoStep(next)
    if (tab) onTabSwitch(tab)
  }

  return (
    <div className="shrink-0 border-t border-indigo-200 bg-indigo-50 px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-start gap-4">
        {/* Step list */}
        <div className="flex shrink-0 flex-wrap gap-1">
          {DEMO_STEPS.map((_step, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                i === demoStep
                  ? 'bg-indigo-600 text-white'
                  : i < demoStep
                    ? 'bg-indigo-200 text-indigo-700'
                    : 'bg-white text-gray-400 hover:bg-indigo-100 hover:text-indigo-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Current step content */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-indigo-700">
            Step {demoStep + 1} / {DEMO_STEPS.length} — {current.title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-indigo-900">{current.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => goTo(demoStep - 1)}
            disabled={isFirst}
            className="rounded border border-indigo-300 px-2.5 py-1 text-xs text-indigo-600 hover:bg-indigo-100 disabled:opacity-30"
          >
            ← 前へ
          </button>
          {isLast ? (
            <button
              onClick={() => setDemoStep(null)}
              className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
            >
              完了
            </button>
          ) : (
            <button
              onClick={() => goTo(demoStep + 1)}
              className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
            >
              次へ →
            </button>
          )}
          <button
            onClick={() => setDemoStep(null)}
            className="text-xs text-indigo-400 hover:text-indigo-600"
            title="デモを終了"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
