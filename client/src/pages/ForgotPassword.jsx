import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
    } finally {
      // Same outcome whether the email exists or the request failed - the
      // backend already returns a generic response either way.
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center text-2xl font-semibold text-white">Reset your password</h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          Enter your email and we'll send you a reset link.
        </p>

        <div className="rounded-lg border border-charcoal-700 bg-charcoal-900 p-6">
          {submitted ? (
            <p className="text-sm text-gray-300">
              If that email is registered, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-300">Email</span>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-gray-400">
            <Link to="/login" className="text-accent-400 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
