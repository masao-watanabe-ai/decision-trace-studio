import { apiClient } from './client'

export type Scenario = {
  id: string
  text: string
  category: string
  vip: boolean
  legal_risk: boolean
  expected_action: string
}

export type EngineResult = {
  final_action: string
  traversed_nodes: string[]
  triggered_boundaries: string[]
  trace: string[]
}

export type ComparisonResult = {
  success: boolean
  mismatch: boolean
}

export type SimulationResult = {
  scenario: Scenario
  engine_result: EngineResult
  comparison: ComparisonResult
  trace_id: string | null
}

export type SimulationRun = {
  id: string
  project_id: string
  results: SimulationResult[]
}

export function generateScenarios(projectId: string): Promise<Scenario[]> {
  return apiClient.post<Scenario[]>(`/projects/${projectId}/scenarios/generate`, {})
}

export function runSimulation(
  projectId: string,
  scenarios: Scenario[],
): Promise<SimulationRun> {
  return apiClient.post<SimulationRun>(`/projects/${projectId}/simulations/run`, {
    scenarios,
  })
}

export function getSimulationResults(simulationId: string): Promise<SimulationRun> {
  return apiClient.get<SimulationRun>(`/simulations/${simulationId}/results`)
}
