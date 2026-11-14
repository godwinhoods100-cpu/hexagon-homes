import { ArrowRight } from "lucide-react"
import { FormEvent, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { errorMessage, useAuth } from "../context/AuthContext"
import { Brand } from "../components/Layout"
import { Button, Field, Input, Select } from "../components/ui"
import { photos } from "../data/sampleProperties"

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname || "/dashboard"

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "").trim()
    const password = String(form.get("password") || "")
    if (!email.includes("@"))
      return setError("Enter a valid email address.")
    if (mode === "signup" && password.length < 8)
      return setError("Choose a password of at least 8 characters.")
    setError("")
    setSubmitting(true)
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await register({
          name: String(form.get("name") || email.split("@")[0]),
          email,
          password,
          role: form.get("role") === "agent" ? "agent" : "user",
        })
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <main className="auth-page">
      <div className="auth-image">
        <img src={photos[2]} alt="Modern home" />
        <blockquote>
          “The right home changes more than your address.”
        </blockquote>
      </div>
      <div className="auth-panel">
        <Brand />
        <div className="auth-form">
          <span className="eyebrow">
            {mode === "login" ? "Welcome back" : "Join Hexagon"}
          </span>
          <h1>
            {mode === "login" ? "Good to see you." : "Create your account."}
          </h1>
          <p>
            {mode === "login"
              ? "Log in to manage your saved homes and enquiries."
              : "Save favourites, contact agents and manage your property journey."}
          </p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            {mode === "signup" && (
              <>
                <Field label="Full name">
                  <Input name="name" required autoComplete="name" />
                </Field>
                <Field label="I am a">
                  <Select name="role">
                    <option value="user">Buyer or renter</option>
                    <option value="agent">Property agent</option>
                  </Select>
                </Field>
              </>
            )}
            <Field label="Email address">
              <Input name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Password">
              <Input
                name="password"
                type="password"
                required
                minLength={mode === "signup" ? 8 : undefined}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </Field>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "login"
                  ? "Log in"
                  : "Create account"}{" "}
              <ArrowRight size={17} />
            </Button>
          </form>
          <p className="auth-switch">
            {mode === "login" ? "New to Hexagon?" : "Already have an account?"}{" "}
            <Link to={mode === "login" ? "/signup" : "/login"}>
              {mode === "login" ? "Create an account" : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
