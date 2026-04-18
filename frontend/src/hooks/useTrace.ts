import { useQuery } from '@tanstack/react-query'
import { fetchProjectTraces, fetchTrace } from '../lib/api/traces'

export function useProjectTraces(projectId: string) {
  return useQuery({
    queryKey: ['traces', 'project', projectId],
    queryFn: () => fetchProjectTraces(projectId),
    enabled: !!projectId,
  })
}

export function useTrace(traceId: string) {
  return useQuery({
    queryKey: ['traces', traceId],
    queryFn: () => fetchTrace(traceId),
    enabled: !!traceId,
  })
}
