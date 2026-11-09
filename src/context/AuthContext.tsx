import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { api, ApiError, ApiUser, hasTokens } from "../api"

export type User = {
  id: number
  name: string
  email: string
  role: "user" | "agent" | "admin"
}

type RegisterInput = {
  name: string
  email: string
  password: string
  role: "user" | "agent"
}

type AuthContextValue = {
  user: User | null
  /** true while we check a saved session on first page load */
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toUser(data: ApiUser): User {
  const fullName = `${data.first_name} ${data.last_name}`.trim()
  return {
    id: data.id,
    name: fullName || data.username || data.email.split("@")[0],
    email: data.email,
    role: data.role,
  }
}

/** Turn any thrown error into a message a person can read. */
export function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401)
      return "Incorrect email or password. Please try again."
    return error.message
  }
  if (error instanceof TypeError)
    return "Cannot reach the server. Check that the API is running."
  return "Something went wrong. Please try again."
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(hasTokens())

  // Restore the session (if any) from the saved JWT.
  useEffect(() => {
    if (!hasTokens()) return
    api
      .profile()
      .then((data) => setUser(toUser(data)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.login(email.trim().toLowerCase(), password)
    setUser(toUser(data))
  }, [])

  const register = useCallback(
    async ({ name, email, password, role }: RegisterInput) => {
      const [first, ...rest] = name.trim().split(/\s+/)
      await api.register({
        email: email.trim().toLowerCase(),
        password,
        first_name: first,
        last_name: rest.join(" "),
        role,
      })
      const data = await api.login(email.trim().toLowerCase(), password)
      setUser(toUser(data))
    },
    [],
  )

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
