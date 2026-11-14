import {
  ArrowRight,
  Building2,
  ChevronRight,
  Heart,
  Home as HomeIcon,
  KeyRound,
  Mail,
  Plus,
  UserRound,
} from "lucide-react"
import { Link } from "react-router-dom"
import { User } from "../context/AuthContext"
import { useListings, useListingsByIds } from "../hooks/useListings"
import { formatPrice } from "../lib/format"

export function Dashboard({ user, favourites }: { user: User; favourites: number[] }) {
  const isAgent = user.role === "agent"
  const mine = useListings(`owner=${user.id}`, isAgent)
  const saved = useListingsByIds(favourites, !isAgent)
  const favouriteHomes = (saved.data ?? []).filter((p) =>
    favourites.includes(p.id),
  )
  const rows = isAgent
    ? (mine.data?.items ?? []).slice(0, 2)
    : favouriteHomes.slice(0, 2)
  return (
    <main className="page-shell dashboard">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Keep track of your property journey in one place.</p>
        </div>
        {user.role === "agent" && (
          <Link className="button button-primary" to="/property/new">
            <Plus size={17} /> Add property
          </Link>
        )}
      </div>
      <div className="dashboard-grid">
        <aside className="dashboard-nav">
          <Link className="active" to="/dashboard">
            <HomeIcon /> Overview
          </Link>
          <Link to="/favourites">
            <Heart /> Favourites
          </Link>
          {user.role === "agent" && (
            <>
              <Link to="/dashboard">
                <Building2 /> My listings
              </Link>
              <Link to="/dashboard">
                <Mail /> Enquiries
              </Link>
            </>
          )}
          <Link to="/dashboard">
            <UserRound /> Profile
          </Link>
        </aside>
        <div className="dashboard-main">
          <div className="metric-grid">
            <div>
              <Heart />
              <b>{favourites.length}</b>
              <span>Saved homes</span>
            </div>
            <div>
              <Mail />
              <b>2</b>
              <span>Open enquiries</span>
            </div>
            <div>
              <KeyRound />
              <b>1</b>
              <span>Upcoming viewing</span>
            </div>
          </div>
          <section className="dashboard-section">
            <div>
              <h2>
                {user.role === "agent" ? "Your listings" : "Recently saved"}
              </h2>
              <Link to={user.role === "agent" ? "/listings" : "/favourites"}>
                View all <ArrowRight />
              </Link>
            </div>
            {rows.map((p) => (
              <div className="property-row" key={p.id}>
                <img src={p.image} alt="" />
                <div>
                  <b>{p.title}</b>
                  <span>
                    {p.city} · {formatPrice(p.price)}
                  </span>
                </div>
                <Link to={`/property/${p.id}`}>
                  <ChevronRight />
                </Link>
              </div>
            ))}
            {!isAgent && !saved.loading && !favouriteHomes.length && (
              <div className="small-empty">
                <Heart />
                <p>You haven't saved any homes yet.</p>
                <Link to="/listings">Explore properties</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
