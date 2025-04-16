import React, { createContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  username: string
  roles: string[]
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage or API on initial render
    const fetchUser = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('user')
        
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setLoading(false)
          return
        }
        
        // Or fetch from API if needed
        const response = await fetch('/api/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
