import { type Trace } from '../../lib/api/traces'

type Props = {
  trace: Trace
}

export function TraceTimeline({ trace }: Props) {
  const { evaluated_conditions, trace_lines, final_action } = trace

  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Evaluation Steps
      </h3>

      <div className="relative">
        {/* 縦線 */}
        <div className="absolute left-[11px] top-3 h-[calc(100%-12px)] w-px bg-gray-200" />

        <div className="space-y-3">
          {evaluated_conditions.length === 0 && (
            <p className="pl-8 text-xs text-gray-400">評価されたノードはありません（条件なし）</p>
          )}

          {evaluated_conditions.map((ec, i) => (
            <div key={ec.node_id} className="relative flex gap-4">
              {/* インジケーター */}
              <div
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  ec.matched
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {ec.matched ? '✓' : i + 1}
              </div>

              <div
                className={`flex-1 rounded-lg border p-3 text-xs ${
                  ec.matched
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-800">{ec.node_label}</span>
                  <span className="font-mono text-gray-400">{ec.node_id}</span>
                  {ec.matched && (
                    <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      matched
                    </span>
                  )}
                </div>

                {ec.condition ? (
                  <code className="block rounded bg-gray-100 px-2 py-1.5 font-mono text-gray-700">
                    {ec.condition}
                  </code>
                ) : (
                  <span className="italic text-gray-400">condition なし</span>
                )}

                <div
                  className={`mt-1.5 font-semibold ${
                    ec.matched ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  → {ec.matched ? 'True' : 'False'}
                </div>
              </div>
            </div>
          ))}

          {/* 最終アクション */}
          <div className="relative flex gap-4">
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-800 text-xs font-bold text-white">
              ⇒
            </div>
            <div className="flex-1 rounded-lg border border-gray-700 bg-gray-900 p-3 text-xs">
              <span className="text-gray-400">final_action: </span>
              <span className="font-mono font-bold text-green-400">{final_action}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw trace */}
      <details className="mt-5">
        <summary className="cursor-pointer select-none text-xs text-gray-400 hover:text-gray-600">
          raw trace ({trace_lines.length} lines)
        </summary>
        <pre className="mt-2 overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-green-400">
          {trace_lines.join('\n')}
        </pre>
      </details>
    </div>
  )
}
