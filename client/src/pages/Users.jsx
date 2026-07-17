import { useEffect, useState } from 'react'
import { listUsers, createUser, resetPassword, deleteUser } from '../api/users'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = { email: '', password: '', role: 'user' }

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [resetTargetId, setResetTargetId] = useState(null)
  const [resetPasswordValue, setResetPasswordValue] = useState('')
  const [resetError, setResetError] = useState(null)

  function load() {
    setLoading(true)
    listUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAddSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    try {
      const newUser = await createUser(form)
      setUsers((list) => [...list, newUser])
      setForm(EMPTY_FORM)
      setShowAddForm(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault()
    setResetError(null)
    try {
      await resetPassword(resetTargetId, resetPasswordValue)
      setResetTargetId(null)
      setResetPasswordValue('')
    } catch (err) {
      setResetError(err.message)
    }
  }

  function handleDelete(id) {
    if (!confirm('Remove this user? Their applications will be deleted too.')) return
    const previous = users
    setUsers((list) => list.filter((u) => u.id !== id))
    deleteUser(id).catch((err) => {
      setUsers(previous)
      alert(`Failed to remove user: ${err.message}`)
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-100">Users</h1>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="rounded-md bg-accent-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-700"
        >
          + Add User
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-6 flex flex-col gap-4 rounded-lg border border-charcoal-700 bg-charcoal-800 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-300">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-300">Temporary password</span>
              <input
                type="text"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-300">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="input"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create user'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-charcoal-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-red-400">Failed to load users: {error}</p>}

      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex flex-col gap-3 rounded-lg border border-charcoal-700 bg-charcoal-800 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="truncate font-semibold text-gray-100">{u.email}</div>
              <div className="text-sm text-gray-400">
                {u.role === 'admin' ? 'Admin' : 'User'} · Added {formatDate(u.createdAt)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setResetTargetId(resetTargetId === u.id ? null : u.id)
                  setResetPasswordValue('')
                  setResetError(null)
                }}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-charcoal-700"
              >
                Reset password
              </button>
              {u.id !== currentUser.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(u.id)}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                >
                  Remove
                </button>
              )}
            </div>

            {resetTargetId === u.id && (
              <form
                onSubmit={handleResetSubmit}
                className="flex w-full flex-wrap items-center gap-2 border-t border-charcoal-700 pt-3 md:w-auto md:border-0 md:pt-0"
              >
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="New password"
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  className="input"
                />
                <button
                  type="submit"
                  className="rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-700"
                >
                  Save
                </button>
                {resetError && <p className="w-full text-sm text-red-400">{resetError}</p>}
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
