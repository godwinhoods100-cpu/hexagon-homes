import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import RequireAuth from "./components/RequireAuth"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { Footer, Navbar } from "./components/Layout"
import { AuthPage } from "./pages/AuthPage"
import { Dashboard } from "./pages/Dashboard"
import { Favourites } from "./pages/Favourites"
import { Home } from "./pages/Home"
import { Listings } from "./pages/Listings"
import { NotFound } from "./pages/NotFound"
import { PropertyDetails } from "./pages/PropertyDetails"
import { PropertyForm } from "./pages/PropertyForm"
import { SimplePage } from "./pages/SimplePage"

function AppShell() {
  const { user, logout } = useAuth()
  const [favourites, setFavourites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hh-favourites") || "[]")
    } catch {
      return []
    }
  })
  const toggleFavourite = (id: number) =>
    setFavourites((current) => {
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
      localStorage.setItem("hh-favourites", JSON.stringify(next))
      return next
    })
  return (
    <div className="app">
      <Navbar user={user} onLogout={() => void logout()} />
      <Routes>
        <Route
          path="/"
          element={
            <Home favourites={favourites} toggleFavourite={toggleFavourite} />
          }
        />
        <Route
          path="/listings"
          element={
            <Listings
              favourites={favourites}
              toggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/property/:id"
          element={
            <PropertyDetails
              favourites={favourites}
              toggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/login"
          element={<AuthPage mode="login" />}
        />
        <Route
          path="/signup"
          element={<AuthPage mode="signup" />}
        />
        <Route path="/about" element={<SimplePage page="about" />} />
        <Route path="/contact" element={<SimplePage page="contact" />} />
        <Route
          path="/favourites"
          element={
            <RequireAuth>
              <Favourites
                favourites={favourites}
                toggleFavourite={toggleFavourite}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              {user && <Dashboard user={user} favourites={favourites} />}
            </RequireAuth>
          }
        />
        <Route
          path="/property/new"
          element={
            <RequireAuth roles={["agent", "admin"]}>
              <PropertyForm />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
