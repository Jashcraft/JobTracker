import { authFetch, handleResponse } from './http'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/users`

export function getUserApplications(userId) {
  return authFetch(`${BASE_URL}/${userId}/applications`).then(handleResponse)
}

export function updateUserApplication(userId, appId, data) {
  return authFetch(`${BASE_URL}/${userId}/applications/${appId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function deleteUserApplication(userId, appId) {
  return authFetch(`${BASE_URL}/${userId}/applications/${appId}`, {
    method: 'DELETE',
  }).then(handleResponse)
}
