import { useNavigate, useParams } from 'react-router-dom'
import { TraceSummaryCard } from '../features/trace-viewer/TraceSummaryCard'
import { TraceTimeline } from '../features/trace-viewer/TraceTimeline'
import { useTrace } from '../hooks/useTrace'

export function TracePage() {
  const { traceId = '' } = useParams<{ traceId: string }>()
  const navigate = useNavigate()
  const { data: trace, isLoading, isError } = useTrace(traceId)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ← 戻る
          </button>
          <span className="text-sm font-semibold text-gray-800">Trace Detail</span>
          {traceId && (
            <span className="font-mono text-xs text-gray-400">
              {traceId.slice(0, 8)}…
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {isLoading && (
          <p className="text-sm text-gray-500">読み込み中...</p>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Trace が見つかりませんでした。
            <br />
            <span className="font-mono text-xs text-red-400">{traceId}</span>
          </div>
        )}

        {!isLoading && !isError && !trace && (
          <p className="text-sm text-gray-400">Trace データがありません。</p>
        )}

        {trace && (
          <div className="space-y-6">
            {/* メタ情報 */}
            <div className="text-xs text-gray-400">
              <span className="mr-3">
                run: <span className="font-mono">{trace.simulation_run_id.slice(0, 8)}…</span>
              </span>
              <span>
                project: <span className="font-mono">{trace.project_id}</span>
              </span>
            </div>

            <TraceSummaryCard trace={trace} />
            <TraceTimeline trace={trace} />
          </div>
        )}
      </div>
    </div>
  )
}
