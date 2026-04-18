import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCurrentFlow, useUpdateFlow } from '../../hooks/useFlow'
import { type NodeType } from '../../lib/api/flows'
import { useStudioStore } from '../../store/studioStore'

const NODE_TYPE_META: Record<
  NodeType,
  { label: string; badge: string; description: string }
> = {
  decision: {
    label: 'Decision',
    badge: 'bg-blue-100 text-blue-700',
    description: '条件を評価し、マッチした場合に action を実行します。',
  },
  boundary: {
    label: 'Boundary',
    badge: 'bg-red-100 text-red-700',
    description:
      'ブロッキング境界ノードです。条件にマッチするとフローを停止し、node.action（通常 human_review）に転送します。triggered_boundaries に記録されます。',
  },
  human_gate: {
    label: 'Human Gate',
    badge: 'bg-amber-100 text-amber-700',
    description:
      'ヒューマンゲートノードです。条件にマッチすると human_review を強制します（node.action を上書き）。triggered_boundaries に記録されます。',
  },
  fallback: {
    label: 'Fallback',
    badge: 'bg-gray-100 text-gray-500',
    description:
      '他のノードがマッチしなかった場合の既定 action です。通常 priority=999 で最後に評価されます。',
  },
}

export function NodeDetailPanel() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const selectedNode = useStudioStore((s) => s.selectedNode)
  const setSelectedNode = useStudioStore((s) => s.setSelectedNode)

  const { data: flow } = useCurrentFlow(projectId)
  const { mutate: saveFlow, isPending } = useUpdateFlow(projectId)

  const [condition, setCondition] = useState('')
  const [action, setAction] = useState('')
  const [priority, setPriority] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setCondition(selectedNode?.condition ?? '')
    setAction(selectedNode?.action ?? '')
    setPriority(selectedNode?.priority ?? 0)
    setSaved(false)
  }, [selectedNode?.id])

  function handleApply() {
    if (!selectedNode || !flow) return
    const updatedNode = { ...selectedNode, condition, action, priority }
    // If this is a newly added node (not yet in flow.nodes), append it
    const isNew = !flow.nodes.some((n) => n.id === selectedNode.id)
    const baseNodes = isNew ? [...flow.nodes, selectedNode] : flow.nodes
    const updatedNodes = baseNodes.map((n) =>
      n.id === selectedNode.id ? updatedNode : n,
    )
    saveFlow(
      { flowId: flow.id, input: { nodes: updatedNodes, edges: flow.edges } },
      {
        onSuccess: () => {
          setSelectedNode(updatedNode)
          setSaved(true)
        },
      },
    )
  }

  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-center text-sm text-gray-400">
          ノードをクリックすると
          <br />
          詳細が表示されます
        </p>
      </div>
    )
  }

  const typeMeta = NODE_TYPE_META[selectedNode.type] ?? NODE_TYPE_META.decision

  const isDirty =
    condition !== (selectedNode.condition ?? '') ||
    action !== (selectedNode.action ?? '') ||
    priority !== (selectedNode.priority ?? 0)

  return (
    <div className="p-4">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Node Detail</h3>
        <button
          onClick={() => setSelectedNode(null)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* メタ情報 */}
      <div className="mb-4 space-y-1 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
        <div>
          <span className="font-medium text-gray-600">id:</span>{' '}
          <span className="font-mono">{selectedNode.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600">type:</span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${typeMeta.badge}`}
          >
            {typeMeta.label}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-600">label:</span>{' '}
          <span className="font-mono">{String(selectedNode.data.label ?? '–')}</span>
        </div>
      </div>

      {/* ノード型の説明 */}
      <div
        className={`mb-4 rounded-lg border px-3 py-2 text-xs ${
          selectedNode.type === 'boundary'
            ? 'border-red-100 bg-red-50 text-red-700'
            : selectedNode.type === 'human_gate'
              ? 'border-amber-100 bg-amber-50 text-amber-700'
              : selectedNode.type === 'decision'
                ? 'border-blue-100 bg-blue-50 text-blue-700'
                : 'border-gray-100 bg-gray-50 text-gray-500'
        }`}
      >
        {typeMeta.description}
      </div>

      {/* priority エディタ */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          priority
          <span className="ml-1 font-normal text-gray-400">
            (昇順で評価 — 小さいほど先)
          </span>
        </label>
        <input
          type="number"
          value={priority}
          onChange={(e) => {
            setPriority(Number(e.target.value))
            setSaved(false)
          }}
          className="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <p className="mt-0.5 text-xs text-gray-400">
          推奨: decision=5, boundary=10, human_gate=20, fallback=999
        </p>
      </div>

      {/* condition エディタ */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          condition
          <span className="ml-1 font-normal text-gray-400">(Python expr)</span>
        </label>
        <textarea
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value)
            setSaved(false)
          }}
          placeholder={"category == 'refund' and legal_risk == True"}
          rows={3}
          spellCheck={false}
          className="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-xs leading-relaxed focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <p className="mt-0.5 text-xs text-gray-400">
          使用可: category, vip, legal_risk, text
        </p>
      </div>

      {/* action エディタ */}
      <div className="mb-5">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          action
          {selectedNode.type === 'human_gate' && (
            <span className="ml-1 font-normal text-amber-500">
              (human_gate は human_review を強制します)
            </span>
          )}
        </label>
        <input
          type="text"
          value={action}
          onChange={(e) => {
            setAction(e.target.value)
            setSaved(false)
          }}
          placeholder="human_review"
          disabled={selectedNode.type === 'human_gate'}
          className="w-full rounded border border-gray-300 px-2 py-1.5 font-mono text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
        />
      </div>

      {/* 保存ボタン */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleApply}
          disabled={isPending || !flow || !isDirty}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40"
        >
          {isPending ? '保存中...' : 'Apply'}
        </button>
        {saved && !isDirty && (
          <span className="text-xs text-green-600">保存しました</span>
        )}
        {isDirty && (
          <span className="text-xs text-amber-500">未保存の変更があります</span>
        )}
      </div>
    </div>
  )
}
