import { type FormEvent, useState } from 'react'
import { useCreateProject, useProjects } from '../hooks/useProjects'
import { ProjectList } from '../features/projects/ProjectList'

const INITIAL_FORM = { name: '', template_id: '', domain_pack_id: '' }

export function ProjectListPage() {
  const { data, isLoading, isError } = useProjects()
  const { mutate: createProject, isPending } = useCreateProject()
  const [form, setForm] = useState(INITIAL_FORM)
  const [formError, setFormError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name || !form.template_id || !form.domain_pack_id) {
      setFormError('すべての項目を入力してください。')
      return
    }
    setFormError('')
    createProject(form, {
      onSuccess: () => setForm(INITIAL_FORM),
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">プロジェクト一覧</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <h2 className="text-sm font-semibold text-gray-700">新規プロジェクト作成</h2>

        <input
          type="text"
          placeholder="プロジェクト名 *"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="template_id *"
          value={form.template_id}
          onChange={(e) => setForm((f) => ({ ...f, template_id: e.target.value }))}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="domain_pack_id *"
          value={form.domain_pack_id}
          onChange={(e) => setForm((f) => ({ ...f, domain_pack_id: e.target.value }))}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {formError && <p className="text-xs text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? '作成中...' : '作成'}
        </button>
      </form>

      {isLoading && <p className="text-gray-500">読み込み中...</p>}
      {isError && <p className="text-red-500">エラーが発生しました。</p>}
      {data && <ProjectList projects={data} />}
    </div>
  )
}
