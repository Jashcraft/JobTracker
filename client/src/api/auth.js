import { authFetch, handleResponse } from './http'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/auth`

export function login(email, password) {
  return authFetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse)
}

export function fetchMe() {
  return authFetch(`${BASE_URL}/me`).then(handleResponse)
}

export function requestPasswordReset(email) {
  return authFetch(`${BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then(handleResponse)
}

export function confirmPasswordReset(token, password) {
  return authFetch(`${BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  }).then(handleResponse)
}
