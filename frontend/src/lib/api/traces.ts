import { apiClient } from './client'
import { type ComparisonResult, type Scenario } from './simulations'

export type EvaluatedCondition = {
  node_id: string
  node_label: string
  condition: string
  matched: boolean
}

export type Trace = {
  id: string
  project_id: string
  simulation_run_id: string
  scenario: Scenario
  final_action: string
  comparison: ComparisonResult
  matched_node_id: string | null
  evaluated_conditions: EvaluatedCondition[]
  trace_lines: string[]
  created_at: string
}

export function fetchProjectTraces(projectId: string): Promise<Trace[]> {
  return apiClient.get<Trace[]>(`/projects/${projectId}/traces`)
}

export function fetchTrace(traceId: string): Promise<Trace> {
  return apiClient.get<Trace>(`/traces/${traceId}`)
}
