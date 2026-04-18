import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchCurrentFlow,
  updateFlow,
  type FlowUpdateInput,
} from '../lib/api/flows'

export function useCurrentFlow(projectId: string) {
  return useQuery({
    queryKey: ['flows', projectId, 'current'],
    queryFn: () => fetchCurrentFlow(projectId),
    enabled: !!projectId,
  })
}

export function useUpdateFlow(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flowId, input }: { flowId: string; input: FlowUpdateInput }) =>
      updateFlow(flowId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flows', projectId, 'current'] })
    },
  })
}
