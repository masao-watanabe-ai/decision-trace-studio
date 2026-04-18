import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Guide content ────────────────────────────────────────────────────────────

const GUIDE_ITEMS = [
  {
    name: 'Design',
    tab: 'flow',
    description:
      'ノードとエッジを視覚的に編集。decision / boundary / human_gate / fallback の4種類を追加・削除・接続できる。',
  },
  {
    name: 'Simulate',
    tab: 'simulate',
    description:
      'シナリオを自動生成してフローを実行検証。評価トレースが自動記録され、各ノードの判定経路を追跡できる。',
  },
  {
    name: 'Compare',
    tab: 'compare',
    description:
      'Before / After でフロー変更の影響を比較。変更されたシナリオのアクション差分を赤・緑でハイライト。',
  },
  {
    name: 'Improve',
    tab: 'improve',
    description:
      'シミュレーション結果から改善提案を自動生成。境界追加・条件分割・優先度調整を承認すると Flow に即反映。',
  },
  {
    name: 'Trace',
    tab: null,
    description:
      '/traces/:id で個別シナリオのノード評価ステップを詳細確認。Simulate 実行後に各結果行にリンクが表示される。',
  },
] as const

// ─── Props ────────────────────────────────────────────────────────────────────

export type HeaderBarProps = {
  projectName: string
  flowVersion: number | undefined
  isDirty: boolean
  isSaving: boolean
  isSaved: boolean
  canUndo: boolean
  showSaveButton: boolean
  isDemoActive: boolean
  onSave: () => void
  onUndo: () => void
  onStartDemo: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeaderBar({
  projectName,
  flowVersion,
  isDirty,
  isSaving,
  isSaved,
  canUndo,
  showSaveButton,
  isDemoActive,
  onSave,
  onUndo,
  onStartDemo,
}: HeaderBarProps) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <header className="relative flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
      {/* Left: navigation */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">
          ← 一覧
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-semibold text-gray-800">Studio</span>
        <span className="max-w-[180px] truncate text-sm font-medium text-gray-600">
          {projectName || '…'}
        </span>
      </div>

      {/* Right: version / state / actions */}
      <div className="flex items-center gap-2">
        {/* Version badge */}
        {flowVersion !== undefined && (
          <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-500">
            v{flowVersion}
          </span>
        )}

        {/* Save state */}
        <span
          className={`text-xs font-medium ${
            isSaving
              ? 'text-gray-400'
              : isDirty
                ? 'text-amber-500'
                : isSaved
                  ? 'text-green-600'
                  : 'text-gray-400'
          }`}
        >
          {isSaving ? '保存中...' : isDirty ? '未保存' : isSaved ? '保存済み' : ''}
        </span>

        {/* Undo */}
        {canUndo && (
          <button
            onClick={onUndo}
            disabled={isSaving}
            title="直前の保存前の状態に戻す"
            className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-40"
          >
            ↩ Undo
          </button>
        )}

        {/* Save */}
        {showSaveButton && (
          <button
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        )}

        {/* Guided Demo */}
        <button
          onClick={onStartDemo}
          title="Guided Demo モードを開始"
          className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
            isDemoActive
              ? 'bg-indigo-600 text-white'
              : 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          ▶ Demo
        </button>

        {/* Guide toggle */}
        <button
          onClick={() => setShowGuide((v) => !v)}
          title="各タブの説明を表示"
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            showGuide
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          ?
        </button>
      </div>

      {/* Guide dropdown */}
      {showGuide && (
        <div
          className="absolute right-4 top-10 z-50 w-96 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
          onMouseLeave={() => setShowGuide(false)}
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Studio ガイド
          </p>
          <div className="space-y-3">
            {GUIDE_ITEMS.map((item) => (
              <div key={item.name} className="flex gap-3">
                <span className="w-20 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-center text-xs font-semibold text-gray-600">
                  {item.name}
                </span>
                <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
