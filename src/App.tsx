import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import RequireAuth from "./components/RequireAuth"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { Footer, Navbar } from "./components/Layout"
import { useFavourites } from "./hooks/useFavourites"
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
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const saved = useFavourites(user)
  const favourites = saved.ids
  const toggleFavourite = (id: number) => {
    if (loading) return // still checking the saved session
    if (!user) {
      // saving homes needs an account: log in, then come back here
      navigate("/login", { state: { from: location } })
      return
    }
    void saved.toggle(id)
  }
  return (
    <div className="app">
      <Navbar user={user} onLogout={() => void logout()} />
      {saved.error && (
        <div
          className="error"
          role="alert"
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}
        >
          {saved.error}
        </div>
      )}
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
        <Route
          path="/property/:id/edit"
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
