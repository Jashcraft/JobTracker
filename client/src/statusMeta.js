// Centralized here (rather than in each component) so the label/color for a
// given status only has to change in one place.
export const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started', badgeClass: 'bg-gray-100 text-gray-600' },
  { value: 'materials_prepped', label: 'Materials Prepped', badgeClass: 'bg-yellow-100 text-yellow-700' },
  { value: 'applied', label: 'Applied', badgeClass: 'bg-blue-100 text-blue-700' },
  { value: 'interview', label: 'Interview', badgeClass: 'bg-green-100 text-green-700' },
  { value: 'offer', label: 'Offer', badgeClass: 'bg-emerald-700 text-white' },
  { value: 'rejected', label: 'Rejected', badgeClass: 'bg-red-100 text-red-700' },
  { value: 'withdrawn', label: 'Withdrawn', badgeClass: 'bg-gray-50 text-gray-400' },
]

export function statusMeta(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[0]
}

export const COVER_LETTER_OPTIONS = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
  { value: 'N_not_requested', label: 'Not requested' },
]
