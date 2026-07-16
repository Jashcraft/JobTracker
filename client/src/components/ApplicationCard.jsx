import { STATUS_OPTIONS, statusMeta, COVER_LETTER_OPTIONS } from '../statusMeta'

const FOLLOW_UP_THRESHOLD_DAYS = 14

function daysSince(dateString) {
  const then = new Date(dateString)
  const now = new Date()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

function toDateInputValue(dateString) {
  return dateString ? dateString.slice(0, 10) : ''
}

function formatDate(dateString) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString()
}

// Only status and dateApplied are editable here - everything else is set once
// at creation via the Add Application form, per the brief's "edit in place" scope.
export default function ApplicationCard({ application, onStatusChange, onDateAppliedChange, onDelete }) {
  const { _id, company, title, link, status, dateFound, dateApplied, coverLetterWritten } = application

  const overdueFollowUp =
    status === 'applied' && dateApplied && daysSince(dateApplied) >= FOLLOW_UP_THRESHOLD_DAYS

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border bg-charcoal-800 p-4 shadow-sm md:flex-row md:items-center md:justify-between ${
        overdueFollowUp ? 'border-amber-600/50 bg-amber-950/30' : 'border-charcoal-700'
      }`}
    >
      <div className="min-w-0 md:w-56">
        <div className="truncate font-semibold text-gray-100">{company}</div>
        <div className="truncate text-sm text-gray-400">
          {link ? (
            <a href={link} target="_blank" rel="noreferrer" className="hover:text-accent-400 hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:w-48">
        <select
          value={status}
          onChange={(e) => onStatusChange(_id, e.target.value)}
          className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${statusMeta(status).badgeClass}`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {overdueFollowUp && (
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
            Follow up?
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-400 md:w-56">
        {dateFound && <div>Found {formatDate(dateFound)}</div>}
        <div className="flex items-center gap-2">
          <label className="text-gray-500">Applied</label>
          <input
            type="date"
            value={toDateInputValue(dateApplied)}
            onChange={(e) => onDateAppliedChange(_id, e.target.value)}
            className="rounded border border-charcoal-700 bg-charcoal-900 px-1.5 py-0.5 text-sm text-gray-100"
          />
          {dateApplied && <span className="text-gray-500">({daysSince(dateApplied)}d ago)</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:w-44 md:justify-end">
        <span className="text-sm text-gray-400">
          Cover letter: {COVER_LETTER_OPTIONS.find((o) => o.value === coverLetterWritten)?.label ?? coverLetterWritten}
        </span>
        <button
          type="button"
          onClick={() => onDelete(_id)}
          aria-label="Delete application"
          className="rounded p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M6.5 4V2.5h3V4M4 4l.5 9.5h7L12 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
