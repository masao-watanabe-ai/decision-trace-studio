import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useComparison } from '../../hooks/useComparison'
import { useCurrentFlow } from '../../hooks/useFlow'
import { useGenerateScenarios } from '../../hooks/useSimulation'
import { type CompareResponse, type FlowSnapshot } from '../../lib/api/comparison'
import { type Scenario } from '../../lib/api/simulations'

type Props = {
  projectId: string
}

function parseFlowSnapshot(json: string): FlowSnapshot | null {
  try {
    const parsed = JSON.parse(json) as unknown
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'nodes' in parsed &&
      'edges' in parsed &&
      Array.isArray((parsed as { nodes: unknown }).nodes) &&
      Array.isArray((parsed as { edges: unknown }).edges)
    ) {
      return parsed as FlowSnapshot
    }
    return null
  } catch {
    return null
  }
}

export function ComparisonPanel({ projectId }: Props) {
  const { data: currentFlow } = useCurrentFlow(projectId)
  const { mutate: generate, isPending: isGenerating } = useGenerateScenarios(projectId)
  const { mutate: compare, isPending: isComparing } = useComparison(projectId)

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [beforeJson, setBeforeJson] = useState('')
  const [parseError, setParseError] = useState('')
  const [result, setResult] = useState<CompareResponse | null>(null)
  const initializedRef = useRef(false)

  // 現在の flow で Before を初期化（一度だけ）
  useEffect(() => {
    if (currentFlow && !initializedRef.current) {
      initializedRef.current = true
      setBeforeJson(
        JSON.stringify(
          { nodes: currentFlow.nodes, edges: currentFlow.edges },
          null,
          2,
        ),
      )
    }
  }, [currentFlow])

  function handleGenerate() {
    generate(undefined, {
      onSuccess: (data) => {
        setScenarios(data)
        setResult(null)
      },
    })
  }

  function handleCompare() {
    if (!currentFlow || scenarios.length === 0) return

    const flowBefore = parseFlowSnapshot(beforeJson)
    if (!flowBefore) {
      setParseError('JSON が不正です。nodes / edges の配列が必要です。')
      return
    }
    setParseError('')

    compare(
      {
        scenarios,
        flow_before: flowBefore,
        flow_after: { nodes: currentFlow.nodes, edges: currentFlow.edges },
      },
      { onSuccess: (data) => setResult(data) },
    )
  }

  const changedCount = result?.diff.filter((d) => d.changed).length ?? 0

  return (
    <div className="p-4">
      {/* コントロール */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isGenerating ? '生成中...' : 'シナリオ生成'}
        </button>
        <button
          onClick={handleCompare}
          disabled={scenarios.length === 0 || !currentFlow || isComparing}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isComparing ? '比較中...' : '比較実行'}
        </button>
        {scenarios.length > 0 && (
          <span className="text-xs text-gray-400">{scenarios.length} シナリオ</span>
        )}
      </div>

      {/* Before / After エディタ */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* Before */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Before
            </span>
            <span className="text-xs text-gray-400">編集可（condition / action を変更）</span>
          </div>
          <textarea
            value={beforeJson}
            onChange={(e) => {
              setBeforeJson(e.target.value)
              setParseError('')
            }}
            spellCheck={false}
            rows={14}
            className="w-full rounded border border-red-200 bg-red-50 px-2 py-2 font-mono text-xs leading-relaxed focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-300"
          />
          {parseError && (
            <p className="mt-1 text-xs text-red-500">{parseError}</p>
          )}
        </div>

        {/* After */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              After
            </span>
            <span className="text-xs text-gray-400">現在の Flow（自動）</span>
          </div>
          <pre className="h-[calc(14*1.5rem+1rem)] w-full overflow-auto rounded border border-green-200 bg-green-50 px-2 py-2 font-mono text-xs leading-relaxed text-gray-700">
            {currentFlow
              ? JSON.stringify(
                  { nodes: currentFlow.nodes, edges: currentFlow.edges },
                  null,
                  2,
                )
              : '読み込み中...'}
          </pre>
        </div>
      </div>

      {/* 差分テーブル */}
      {result && (
        <section>
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              差分結果
            </h3>
            {changedCount > 0 ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {changedCount} 件変化
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                変化なし
              </span>
            )}
            <span className="text-xs text-gray-400">全 {result.diff.length} シナリオ</span>
          </div>

          <div className="overflow-auto rounded border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">scenario</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">category</th>
                  <th className="px-3 py-2 text-left font-medium text-red-400">before</th>
                  <th className="px-3 py-2 text-left font-medium text-green-600">after</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">diff</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">traces</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.diff.map((d, i) => {
                  const beforeResult = result.before_results[i]
                  return (
                    <tr
                      key={d.scenario_id}
                      className={d.changed ? 'bg-amber-50' : 'bg-white'}
                    >
                      <td className="max-w-[180px] truncate px-3 py-2 text-gray-700">
                        {d.scenario_text}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {beforeResult?.scenario.category}
                      </td>
                      {/* Before action */}
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono font-medium ${
                            d.changed
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {d.action_before}
                        </span>
                      </td>
                      {/* After action */}
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono font-medium ${
                            d.changed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {d.action_after}
                        </span>
                      </td>
                      {/* Diff badge */}
                      <td className="px-3 py-2">
                        {d.changed ? (
                          <span className="font-semibold text-amber-600">⚡ changed</span>
                        ) : (
                          <span className="text-gray-400">– same</span>
                        )}
                      </td>
                      {/* Trace links */}
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          {d.trace_before_id && (
                            <Link
                              to={`/traces/${d.trace_before_id}`}
                              className="text-red-400 hover:text-red-600 hover:underline"
                            >
                              B→
                            </Link>
                          )}
                          {d.trace_after_id && (
                            <Link
                              to={`/traces/${d.trace_after_id}`}
                              className="text-green-600 hover:text-green-700 hover:underline"
                            >
                              A→
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* サマリーカード */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg border border-gray-200 bg-white py-2">
              <div className="text-lg font-bold text-gray-800">{result.diff.length}</div>
              <div className="text-gray-400">total</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 py-2">
              <div className="text-lg font-bold text-amber-700">{changedCount}</div>
              <div className="text-amber-600">changed</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white py-2">
              <div className="text-lg font-bold text-gray-500">
                {result.diff.length - changedCount}
              </div>
              <div className="text-gray-400">unchanged</div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
