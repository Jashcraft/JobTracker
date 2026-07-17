const TOKEN_KEY = 'token'
export const AUTH_LOGOUT_EVENT = 'auth:logout'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Thin wrapper around fetch that attaches the stored bearer token and clears
// it (notifying AuthContext) if the server ever says the session is invalid.
export async function authFetch(url, options = {}) {
  const token = getToken()
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    clearToken()
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
  }

  return res
}

export async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed with status ${res.status}`)
  }
  // DELETE returns 204 No Content - nothing to parse.
  if (res.status === 204) return null
  return res.json()
}
