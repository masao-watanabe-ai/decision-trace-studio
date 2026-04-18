import { apiClient } from './client'

export type NodeType = 'decision' | 'boundary' | 'human_gate' | 'fallback'

export type FlowNode = {
  id: string
  type: NodeType
  data: Record<string, unknown>
  position: { x: number; y: number }
  condition: string
  action: string
  priority: number
}

export type FlowEdge = {
  id: string
  source: string
  target: string
}

export type Flow = {
  id: string
  project_id: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  version: number
}

export type FlowUpdateInput = {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export function fetchCurrentFlow(projectId: string): Promise<Flow> {
  return apiClient.get<Flow>(`/projects/${projectId}/flows/current`)
}

export function updateFlow(flowId: string, input: FlowUpdateInput): Promise<Flow> {
  return apiClient.put<Flow>(`/flows/${flowId}`, input)
}
