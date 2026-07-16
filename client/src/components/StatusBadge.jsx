import { statusMeta } from '../statusMeta'

export default function StatusBadge({ status }) {
  const meta = statusMeta(status)
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badgeClass}`}>
      {meta.label}
    </span>
  )
}
