import { apiClient } from './client'
import type { NodeType } from './flows'

export type SuggestionType = 'boundary_add' | 'condition_split' | 'priority_adjust'
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected'

export type Suggestion = {
  id: string
  project_id: string
  type: SuggestionType
  target_node_id: string | null
  reason: string
  impact: string
  proposed_node_type: NodeType | null
  proposed_condition: string | null
  proposed_action: string | null
  proposed_priority: number | null
  status: SuggestionStatus
  applied_to_flow: boolean
}

export function generateSuggestions(projectId: string): Promise<Suggestion[]> {
  return apiClient.post<Suggestion[]>(`/projects/${projectId}/suggestions/generate`, {})
}

export function fetchSuggestions(projectId: string): Promise<Suggestion[]> {
  return apiClient.get<Suggestion[]>(`/projects/${projectId}/suggestions`)
}

export function acceptSuggestion(suggestionId: string): Promise<Suggestion> {
  return apiClient.post<Suggestion>(`/suggestions/${suggestionId}/accept`, {})
}

export function rejectSuggestion(suggestionId: string): Promise<Suggestion> {
  return apiClient.post<Suggestion>(`/suggestions/${suggestionId}/reject`, {})
}
