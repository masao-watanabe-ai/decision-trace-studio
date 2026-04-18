import { useMutation } from '@tanstack/react-query'
import {
  generateScenarios,
  runSimulation,
  type Scenario,
  type SimulationRun,
} from '../lib/api/simulations'

export function useGenerateScenarios(projectId: string) {
  return useMutation<Scenario[], Error, void>({
    mutationFn: () => generateScenarios(projectId),
  })
}

export function useRunSimulation(projectId: string) {
  return useMutation<SimulationRun, Error, Scenario[]>({
    mutationFn: (scenarios: Scenario[]) => runSimulation(projectId, scenarios),
  })
}
