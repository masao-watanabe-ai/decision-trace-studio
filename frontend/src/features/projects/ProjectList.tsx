import { Link } from 'react-router-dom'
import { type Project } from '../../lib/api/projects'

type Props = {
  projects: Project[]
}

export function ProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <p className="text-gray-500">プロジェクトがありません。</p>
  }

  return (
    <ul className="space-y-3">
      {projects.map((project) => (
        <li
          key={project.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
              )}
              <div className="mt-2 flex gap-3 text-xs text-gray-400">
                <span>template: {project.template_id}</span>
                <span>domain: {project.domain_pack_id}</span>
              </div>
            </div>
            <Link
              to={`/projects/${project.id}/studio`}
              className="ml-4 shrink-0 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Studio →
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
