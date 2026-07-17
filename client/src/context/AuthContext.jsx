import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { login as loginRequest, fetchMe } from '../api/auth'
import { getToken, setToken, clearToken, AUTH_LOGOUT_EVENT } from '../api/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    fetchMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout)
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: loggedInUser } = await loginRequest(email, password)
    setToken(token)
    setUser(loggedInUser)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
