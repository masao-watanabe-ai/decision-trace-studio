import { apiClient } from './client'
import { type FlowEdge, type FlowNode } from './flows'
import { type Scenario, type SimulationResult } from './simulations'

export type FlowSnapshot = {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export type ScenarioDiff = {
  scenario_id: string
  scenario_text: string
  action_before: string
  action_after: string
  changed: boolean
  trace_before_id: string | null
  trace_after_id: string | null
}

export type CompareResponse = {
  id: string
  project_id: string
  before_results: SimulationResult[]
  after_results: SimulationResult[]
  diff: ScenarioDiff[]
}

export type CompareRequest = {
  scenarios: Scenario[]
  flow_before: FlowSnapshot
  flow_after: FlowSnapshot
}

export function runComparison(
  projectId: string,
  request: CompareRequest,
): Promise<CompareResponse> {
  return apiClient.post<CompareResponse>(
    `/projects/${projectId}/simulations/compare`,
    request,
  )
}
