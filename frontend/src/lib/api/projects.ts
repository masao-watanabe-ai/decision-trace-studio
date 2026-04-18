import { apiClient } from './client'

export type Project = {
  id: string
  name: string
  template_id: string
  domain_pack_id: string
  description: string
  created_at: string
}

export type CreateProjectInput = {
  name: string
  template_id: string
  domain_pack_id: string
}

export function fetchProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>('/projects')
}

export function fetchProject(projectId: string): Promise<Project> {
  return apiClient.get<Project>(`/projects/${projectId}`)
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiClient.post<Project>('/projects', input)
}
