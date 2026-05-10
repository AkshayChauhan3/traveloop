import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, clearToken, getToken, setToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('traveloop_user')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem('traveloop_user')
      return null
    }
  })
  const [token, setAuthToken] = useState(() => getToken())
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    let active = true
    const hydrate = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const result = await authApi.me()
        if (!active) return
        setUser(result.user)
        localStorage.setItem('traveloop_user', JSON.stringify(result.user))
      } catch (error) {
        if (!active) return
        clearSession()
      } finally {
        if (active) setLoading(false)
      }
    }

    hydrate()
    return () => {
      active = false
    }
  }, [token])

  const setSession = (nextToken, nextUser) => {
    setToken(nextToken)
    setAuthToken(nextToken)
    if (nextUser) {
      setUser(nextUser)
      localStorage.setItem('traveloop_user', JSON.stringify(nextUser))
    }
    setLoading(false)
  }

  const clearSession = () => {
    clearToken()
    setAuthToken(null)
    setUser(null)
    setLoading(false)
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login: (nextToken, nextUser) => setSession(nextToken, nextUser),
    logout: clearSession,
    refreshUser: async () => {
      if (!getToken()) return null
      const result = await authApi.me()
      setUser(result.user)
      localStorage.setItem('traveloop_user', JSON.stringify(result.user))
      return result.user
    },
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
