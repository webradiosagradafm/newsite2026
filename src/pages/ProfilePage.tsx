import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshAvatar: (userId?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshAvatar: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('getSession error:', error)
        }

        if (!isMounted) return

        setSession(data.session ?? null)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      setSession(session ?? null)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
  }

  const refreshAvatar = async (_userId?: string) => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session ?? null)
    setUser(data.session?.user ?? null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        refreshAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)