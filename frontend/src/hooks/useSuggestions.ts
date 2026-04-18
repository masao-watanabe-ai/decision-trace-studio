import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptSuggestion,
  fetchSuggestions,
  generateSuggestions,
  rejectSuggestion,
} from '../lib/api/suggestions'

export function useSuggestions(projectId: string) {
  return useQuery({
    queryKey: ['suggestions', projectId],
    queryFn: () => fetchSuggestions(projectId),
    enabled: !!projectId,
  })
}

export function useGenerateSuggestions(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => generateSuggestions(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions', projectId] })
    },
  })
}

export function useAcceptSuggestion(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (suggestionId: string) => acceptSuggestion(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions', projectId] })
      // flow may have changed — refresh Flow / Simulate / Compare tabs
      queryClient.invalidateQueries({ queryKey: ['flows', projectId, 'current'] })
    },
  })
}

export function useRejectSuggestion(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (suggestionId: string) => rejectSuggestion(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions', projectId] })
    },
  })
}
