import {
  ArrowRight,
  Heart,
  Home as HomeIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { User } from "../context/AuthContext"
import { Button, Input } from "./ui"

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Hexagon Homes home">
      <span className="brand-mark">
        <HomeIcon size={18} strokeWidth={2.2} />
      </span>
      <span>
        HEXAGON <b>HOMES</b>
      </span>
    </Link>
  )
}

export function Navbar({
  user,
  onLogout,
}: {
  user: User | null
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Brand />
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <NavLink to="/" onClick={close}>
            Home
          </NavLink>
          <NavLink to="/listings" onClick={close}>
            Properties
          </NavLink>
          <NavLink to="/about" onClick={close}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={close}>
            Contact
          </NavLink>
          <div className="mobile-actions">
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={close}>
                  Dashboard
                </NavLink>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogout()
                    close()
                  }}
                >
                  <LogOut size={16} /> Log out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={close}>
                  Log in
                </NavLink>
                <Link
                  className="button button-primary"
                  to="/signup"
                  onClick={close}
                >
                  Join Hexagon
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <Link
                className="icon-link"
                to="/favourites"
                aria-label="Favourites"
              >
                <Heart size={19} />
              </Link>
              <Link className="avatar" to="/dashboard">
                {user.name.charAt(0)}
              </Link>
              <button
                type="button"
                className="icon-link"
                aria-label="Log out"
                title="Log out"
                onClick={onLogout}
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <>
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Link className="button button-primary compact" to="/signup">
                Join Hexagon
              </Link>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          className="menu-button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Exceptional homes. Trusted expertise.
            <br />A more considered way to move.
          </p>
        </div>
        <div>
          <b>Explore</b>
          <Link to="/listings">Properties</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <b>For owners</b>
          <Link to="/signup">List a property</Link>
          <Link to="/dashboard">Agent dashboard</Link>
          <Link to="/contact">Valuations</Link>
        </div>
        <div>
          <b>Stay informed</b>
          <p>New homes and market notes, thoughtfully selected.</p>
          <div className="subscribe">
            <Input
              type="email"
              aria-label="Email address"
              placeholder="Email address"
            />
            <Button aria-label="Subscribe">
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Hexagon Homes</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  )
}
