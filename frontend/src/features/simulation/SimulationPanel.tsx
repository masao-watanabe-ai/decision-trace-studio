import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGenerateScenarios, useRunSimulation } from '../../hooks/useSimulation'
import { type Scenario, type SimulationRun } from '../../lib/api/simulations'

type Props = {
  projectId: string
}

export function SimulationPanel({ projectId }: Props) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [run, setRun] = useState<SimulationRun | null>(null)

  const { mutate: generate, isPending: isGenerating } = useGenerateScenarios(projectId)
  const { mutate: runSim, isPending: isRunning } = useRunSimulation(projectId)

  function handleGenerate() {
    generate(undefined, {
      onSuccess: (data) => {
        setScenarios(data)
        setRun(null)
      },
    })
  }

  function handleRun() {
    runSim(scenarios, {
      onSuccess: (data) => setRun(data),
    })
  }

  const passCount = run?.results.filter((r) => r.comparison.success).length ?? 0

  return (
    <div className="p-4">
      {/* アクションボタン */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded bg-gray-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isGenerating ? '生成中...' : 'シナリオ生成'}
        </button>
        <button
          onClick={handleRun}
          disabled={scenarios.length === 0 || isRunning}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? '実行中...' : 'シミュレーション実行'}
        </button>
        {scenarios.length > 0 && (
          <span className="text-xs text-gray-400">{scenarios.length} シナリオ</span>
        )}
      </div>

      {/* シナリオ一覧（実行前） */}
      {scenarios.length > 0 && !run && (
        <section className="mb-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            生成されたシナリオ
          </h3>
          <div className="overflow-auto rounded border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">text</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">category</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">legal_risk</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">vip</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">expected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scenarios.map((s) => (
                  <tr key={s.id} className="bg-white">
                    <td className="max-w-xs truncate px-3 py-2 text-gray-700">{s.text}</td>
                    <td className="px-3 py-2 text-gray-500">{s.category}</td>
                    <td className="px-3 py-2 text-gray-500">{s.legal_risk ? '✓' : '–'}</td>
                    <td className="px-3 py-2 text-gray-500">{s.vip ? '✓' : '–'}</td>
                    <td className="px-3 py-2 font-mono text-gray-500">{s.expected_action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 結果テーブル */}
      {run && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            結果 —{' '}
            <span
              className={passCount === run.results.length ? 'text-green-600' : 'text-red-500'}
            >
              {passCount}/{run.results.length} passed
            </span>
          </h3>
          <div className="overflow-auto rounded border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">text</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">category</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">expected</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">actual</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">status</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {run.results.map((r) => (
                  <tr
                    key={r.scenario.id}
                    className={r.comparison.success ? 'bg-white' : 'bg-red-50'}
                  >
                    <td className="max-w-[160px] truncate px-3 py-2 text-gray-700">
                      {r.scenario.text}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{r.scenario.category}</td>
                    <td className="px-3 py-2 font-mono text-gray-400">
                      {r.scenario.expected_action}
                    </td>
                    <td className="px-3 py-2 font-mono font-medium text-gray-800">
                      {r.engine_result.final_action}
                    </td>
                    <td className="px-3 py-2">
                      {r.comparison.success ? (
                        <span className="font-medium text-green-600">✓ pass</span>
                      ) : (
                        <span className="font-medium text-red-500">✗ mismatch</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {r.trace_id ? (
                        <Link
                          to={`/traces/${r.trace_id}`}
                          className="text-blue-500 hover:text-blue-700 hover:underline"
                        >
                          Trace →
                        </Link>
                      ) : (
                        <span className="text-gray-300">–</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
