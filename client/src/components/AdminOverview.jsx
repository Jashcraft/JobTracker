import { useEffect, useState } from 'react'
import { listUsers } from '../api/users'
import { getApplications, updateApplication, deleteApplication } from '../api/applications'
import { getUserApplications, updateUserApplication, deleteUserApplication } from '../api/adminApplications'
import { useAuth } from '../context/AuthContext'
import UserApplicationsPanel from './UserApplicationsPanel'

export default function AdminOverview() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>
  if (error) return <p className="text-sm text-red-400">Failed to load users: {error}</p>

  return (
    <div className="flex flex-col gap-3">
      {users.map((u) => {
        const isSelf = u.id === currentUser.id
        const isOpen = expandedId === u.id

        return (
          <div key={u.id} className="overflow-hidden rounded-lg border border-charcoal-700 bg-charcoal-800">
            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : u.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-charcoal-700/50"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-semibold text-gray-100">{u.email}</span>
                {isSelf && <span className="text-xs text-gray-500">(you)</span>}
                {u.role === 'admin' && (
                  <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-xs font-medium text-accent-400">
                    Admin
                  </span>
                )}
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              >
                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-charcoal-700 p-4">
                <UserApplicationsPanel
                  key={u.id}
                  allowAddLink={isSelf}
                  fetchApplications={isSelf ? getApplications : () => getUserApplications(u.id)}
                  updateApplicationFn={
                    isSelf ? updateApplication : (appId, data) => updateUserApplication(u.id, appId, data)
                  }
                  deleteApplicationFn={
                    isSelf ? deleteApplication : (appId) => deleteUserApplication(u.id, appId)
                  }
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
