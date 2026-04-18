import { type Trace } from '../../lib/api/traces'

type Props = {
  trace: Trace
}

export function TraceSummaryCard({ trace }: Props) {
  const { scenario, final_action, comparison, matched_node_id } = trace

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Scenario</h3>
        {comparison.success ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            ✓ pass
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            ✗ mismatch
          </span>
        )}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-700">{scenario.text}</p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-gray-50 px-2.5 py-2">
          <div className="mb-0.5 text-gray-400">category</div>
          <div className="font-semibold text-gray-700">{scenario.category}</div>
        </div>
        <div className="rounded-md bg-gray-50 px-2.5 py-2">
          <div className="mb-0.5 text-gray-400">vip</div>
          <div className="font-semibold text-gray-700">{scenario.vip ? '✓' : '–'}</div>
        </div>
        <div className="rounded-md bg-gray-50 px-2.5 py-2">
          <div className="mb-0.5 text-gray-400">legal_risk</div>
          <div className="font-semibold text-gray-700">{scenario.legal_risk ? '✓' : '–'}</div>
        </div>
        <div className="rounded-md bg-gray-50 px-2.5 py-2">
          <div className="mb-0.5 text-gray-400">expected_action</div>
          <div className="font-mono font-semibold text-gray-700">{scenario.expected_action}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">final_action</span>
          <span
            className={`font-mono font-semibold ${
              comparison.success ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {final_action}
          </span>
        </div>
        {matched_node_id ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">matched node</span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-blue-700">
              {matched_node_id}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">matched node</span>
            <span className="text-gray-400">fallback</span>
          </div>
        )}
      </div>
    </div>
  )
}
