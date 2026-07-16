import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApplications, updateApplication, deleteApplication } from '../api/applications'
import { STATUS_OPTIONS } from '../statusMeta'
import ApplicationCard from '../components/ApplicationCard'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'company', label: 'Company (A-Z)' },
  { value: 'status', label: 'Status' },
  { value: 'dateApplied', label: 'Date applied' },
]

function sortApplications(applications, sortBy) {
  const sorted = [...applications]
  switch (sortBy) {
    case 'company':
      return sorted.sort((a, b) => a.company.localeCompare(b.company))
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status))
    case 'dateApplied':
      return sorted.sort((a, b) => new Date(b.dateApplied ?? 0) - new Date(a.dateApplied ?? 0))
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleApplications = useMemo(() => {
    const filtered =
      statusFilter === 'all' ? applications : applications.filter((a) => a.status === statusFilter)
    return sortApplications(filtered, sortBy)
  }, [applications, statusFilter, sortBy])

  function patchApplication(id, patch) {
    // Optimistic update so the UI feels instant; roll back if the request fails.
    const previous = applications
    setApplications((apps) => apps.map((a) => (a._id === id ? { ...a, ...patch } : a)))
    updateApplication(id, patch).catch((err) => {
      setApplications(previous)
      alert(`Failed to update: ${err.message}`)
    })
  }

  function handleStatusChange(id, status) {
    patchApplication(id, { status })
  }

  function handleDateAppliedChange(id, dateValue) {
    patchApplication(id, { dateApplied: dateValue || null })
  }

  function handleDelete(id) {
    if (!confirm('Delete this application?')) return
    const previous = applications
    setApplications((apps) => apps.filter((a) => a._id !== id))
    deleteApplication(id).catch((err) => {
      setApplications(previous)
      alert(`Failed to delete: ${err.message}`)
    })
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-100">Applications</h1>
        <Link
          to="/add"
          className="rounded-md bg-accent-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-700"
        >
          + Add Application
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-charcoal-700 bg-charcoal-800 px-3 py-1.5 text-sm text-gray-200"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-charcoal-700 bg-charcoal-800 px-3 py-1.5 text-sm text-gray-200"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-red-400">Failed to load applications: {error}</p>}

      {!loading && !error && visibleApplications.length === 0 && (
        <p className="text-sm text-gray-400">
          {applications.length === 0 ? (
            <>No applications yet — <Link to="/add" className="text-accent-400 hover:underline">add your first one</Link>.</>
          ) : (
            'No applications match this filter.'
          )}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {visibleApplications.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onStatusChange={handleStatusChange}
            onDateAppliedChange={handleDateAppliedChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
