import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createApplication } from '../api/applications'
import { STATUS_OPTIONS, COVER_LETTER_OPTIONS } from '../statusMeta'

const EMPTY_FORM = {
  company: '',
  title: '',
  link: '',
  contactEmail: '',
  status: 'not_started',
  dateFound: '',
  coverLetterWritten: 'N',
  notes: '',
}

export default function AddApplication() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createApplication({
        ...form,
        dateFound: form.dateFound || null,
      })
      navigate('/')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-gray-100">Add Application</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Company" required>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => updateField('company', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Job Title" required>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Posting Link">
          <input
            type="url"
            value={form.link}
            onChange={(e) => updateField('link', e.target.value)}
            placeholder="https://..."
            className="input"
          />
        </Field>

        <Field label="Contact Email">
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="input"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date Found">
            <input
              type="date"
              value={form.dateFound}
              onChange={(e) => updateField('dateFound', e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Cover Letter Written">
          <select
            value={form.coverLetterWritten}
            onChange={(e) => updateField('coverLetterWritten', e.target.value)}
            className="input"
          >
            {COVER_LETTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={4}
            className="input"
          />
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Application'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {children}
    </label>
  )
}
