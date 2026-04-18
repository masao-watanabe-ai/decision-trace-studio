import { Routes, Route } from 'react-router-dom'
import { ProjectListPage } from '../../pages/ProjectListPage'
import { StudioPage } from '../../pages/StudioPage'
import { TracePage } from '../../pages/TracePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProjectListPage />} />
      <Route path="/projects/:projectId/studio" element={<StudioPage />} />
      <Route path="/traces/:traceId" element={<TracePage />} />
    </Routes>
  )
}
