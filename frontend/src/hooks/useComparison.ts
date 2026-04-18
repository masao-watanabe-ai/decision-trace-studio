import { useMutation } from '@tanstack/react-query'
import {
  runComparison,
  type CompareRequest,
  type CompareResponse,
} from '../lib/api/comparison'

export function useComparison(projectId: string) {
  return useMutation<CompareResponse, Error, CompareRequest>({
    mutationFn: (request: CompareRequest) => runComparison(projectId, request),
  })
}
