import {
  useAcceptSuggestion,
  useGenerateSuggestions,
  useRejectSuggestion,
  useSuggestions,
} from '../../hooks/useSuggestions'
import type { Suggestion, SuggestionType } from '../../lib/api/suggestions'

const TYPE_LABELS: Record<SuggestionType, string> = {
  boundary_add: '境界追加',
  condition_split: '条件分割',
  priority_adjust: '優先度調整',
}

const TYPE_COLORS: Record<SuggestionType, string> = {
  boundary_add: 'bg-purple-100 text-purple-700',
  condition_split: 'bg-orange-100 text-orange-700',
  priority_adjust: 'bg-blue-100 text-blue-700',
}

const FLOW_APPLICABLE: SuggestionType[] = ['boundary_add', 'priority_adjust']

function SuggestionCard({
  suggestion,
  onAccept,
  onReject,
  isPending,
}: {
  suggestion: Suggestion
  onAccept: (id: string) => void
  onReject: (id: string) => void
  isPending: boolean
}) {
  const isActionable = suggestion.status === 'pending'

  return (
    <div
      className={`rounded-lg border p-4 ${
        suggestion.status === 'accepted'
          ? 'border-green-200 bg-green-50'
          : suggestion.status === 'rejected'
            ? 'border-gray-200 bg-gray-50 opacity-60'
            : 'border-gray-200 bg-white'
      }`}
    >
      {/* header row */}
      <div className="mb-2 flex flex-wrap items-start gap-2">
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[suggestion.type]}`}
        >
          {TYPE_LABELS[suggestion.type]}
        </span>

        {suggestion.status === 'accepted' && (
          <span className="text-xs font-medium text-green-600">承認済み</span>
        )}
        {suggestion.status === 'rejected' && (
          <span className="text-xs font-medium text-gray-400">却下済み</span>
        )}

        {suggestion.applied_to_flow && (
          <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
            Flow に反映済み
          </span>
        )}

        {suggestion.status === 'accepted' &&
          !suggestion.applied_to_flow &&
          FLOW_APPLICABLE.includes(suggestion.type) && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Flow 未反映
            </span>
          )}
      </div>

      {suggestion.target_node_id && (
        <p className="mb-1 font-mono text-xs text-gray-400">
          対象ノード: {suggestion.target_node_id}
        </p>
      )}

      <p className="mb-1 text-xs text-gray-700">{suggestion.reason}</p>
      <p className="mb-3 text-xs text-gray-500">{suggestion.impact}</p>

      {(suggestion.proposed_node_type ||
        suggestion.proposed_condition ||
        suggestion.proposed_action ||
        suggestion.proposed_priority !== null) && (
        <div className="mb-3 space-y-0.5 rounded bg-gray-100 px-3 py-2 text-xs">
          {suggestion.proposed_node_type && (
            <div>
              <span className="font-medium text-gray-600">node type: </span>
              <span className="font-mono text-gray-700">{suggestion.proposed_node_type}</span>
            </div>
          )}
          {suggestion.proposed_condition && (
            <div>
              <span className="font-medium text-gray-600">condition: </span>
              <span className="font-mono text-gray-700">{suggestion.proposed_condition}</span>
            </div>
          )}
          {suggestion.proposed_action && (
            <div>
              <span className="font-medium text-gray-600">action: </span>
              <span className="font-mono text-gray-700">{suggestion.proposed_action}</span>
            </div>
          )}
          {suggestion.proposed_priority !== null && (
            <div>
              <span className="font-medium text-gray-600">priority: </span>
              <span className="font-mono text-gray-700">{suggestion.proposed_priority}</span>
            </div>
          )}
        </div>
      )}

      {isActionable && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(suggestion.id)}
            disabled={isPending}
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
          >
            {FLOW_APPLICABLE.includes(suggestion.type) ? '承認 & Flow 反映' : '承認'}
          </button>
          <button
            onClick={() => onReject(suggestion.id)}
            disabled={isPending}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            却下
          </button>
        </div>
      )}
    </div>
  )
}

export function ImprovePanel({ projectId }: { projectId: string }) {
  const { data: suggestions, isLoading } = useSuggestions(projectId)
  const { mutate: generate, isPending: isGenerating } = useGenerateSuggestions(projectId)
  const { mutate: accept, isPending: isAccepting } = useAcceptSuggestion(projectId)
  const { mutate: reject, isPending: isRejecting } = useRejectSuggestion(projectId)

  const isActing = isAccepting || isRejecting

  const pending = suggestions?.filter((s) => s.status === 'pending') ?? []
  const resolved = suggestions?.filter((s) => s.status !== 'pending') ?? []

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Improve</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            シミュレーション結果からルール改善の提案を生成します。承認すると Flow に即反映されます。
          </p>
        </div>
        <button
          onClick={() => generate()}
          disabled={isGenerating}
          className="rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          {isGenerating ? '分析中...' : '提案を生成'}
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">読み込み中...</p>}

      {!isLoading && (!suggestions || suggestions.length === 0) && (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-400">
            まず「提案を生成」をクリックしてください。
            <br />
            シミュレーションを実行済みの場合、改善提案が表示されます。
          </p>
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            未対応 ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onAccept={accept}
                onReject={reject}
                isPending={isActing}
              />
            ))}
          </div>
        </section>
      )}

      {resolved.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            対応済み ({resolved.length})
          </h3>
          <div className="space-y-3">
            {resolved.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onAccept={accept}
                onReject={reject}
                isPending={isActing}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
