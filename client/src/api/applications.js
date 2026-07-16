const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/applications`

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed with status ${res.status}`)
  }
  // DELETE returns 204 No Content - nothing to parse.
  if (res.status === 204) return null
  return res.json()
}

export function getApplications() {
  return fetch(BASE_URL).then(handleResponse)
}

export function createApplication(data) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function updateApplication(id, data) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function deleteApplication(id) {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse)
}
