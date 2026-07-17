import { authFetch, handleResponse } from './http'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/users`

export function listUsers() {
  return authFetch(BASE_URL).then(handleResponse)
}

export function createUser(data) {
  return authFetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function resetPassword(id, password) {
  return authFetch(`${BASE_URL}/${id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }).then(handleResponse)
}

export function deleteUser(id) {
  return authFetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse)
}
