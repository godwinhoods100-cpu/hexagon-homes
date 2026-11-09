import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth, User } from "../context/AuthContext"

/**
 * Protects a route. Not logged in -> /login (and remember where they were going).
 * Logged in but wrong role -> /dashboard.
 */
export default function RequireAuth({
  children,
  roles,
}: {
  children: ReactNode
  roles?: User["role"][]
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading)
    return (
      <main className="page-shell">
        <p>Checking your session…</p>
      </main>
    )
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
