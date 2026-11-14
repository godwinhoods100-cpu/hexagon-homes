import { Link } from "react-router-dom"

export function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>This address doesn't feel like home.</h1>
      <p>The page may have moved, or the link might be out of date.</p>
      <Link className="button button-primary" to="/">
        Return home
      </Link>
    </main>
  )
}
