import React, { createContext, useContext } from 'react'

type AuthContextType = {
  user: null
  session: null
  loading: false
  signOut: () => Promise<void>
  refreshAvatar: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signOut: async () => {},
  refreshAvatar: async () => {},
})

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const signOut = async () => {}

  const refreshAvatar = async () => {}

  return (
    <AuthContext.Provider
      value={{
        user: null,
        session: null,
        loading: false,
        signOut,
        refreshAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
