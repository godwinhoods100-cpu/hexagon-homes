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
import { ReactNode, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../api"
import { Button } from "../components/ui"
import { User } from "../context/AuthContext"
import {
  useEnquiries,
  useListings,
  useListingsByIds,
} from "../hooks/useListings"
import { describeError } from "../lib/errors"
import { formatPrice } from "../lib/format"

function Metric({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value: ReactNode
  label: string
}) {
  return (
    <div>
      {icon}
      <b>{value}</b>
      <span>{label}</span>
    </div>
  )
}

export function Dashboard({
  user,
  favourites,
}: {
  user: User
  favourites: number[]
}) {
  const isAgent = user.role === "agent"
  const mine = useListings(`owner=${user.id}`, isAgent)
  const enquiries = useEnquiries(isAgent)
  const market = useListings("")
  const saved = useListingsByIds(favourites, !isAgent)
  const favouriteHomes = (saved.data ?? []).filter((p) =>
    favourites.includes(p.id),
  )
  const [actionError, setActionError] = useState("")

  const remove = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return
    setActionError("")
    try {
      await api.deleteProperty(id)
      mine.reload()
      enquiries.reload()
      market.reload()
    } catch (err) {
      setActionError(describeError(err).message)
    }
  }
  const titleFor = (id: number) =>
    mine.data?.items.find((p) => p.id === id)?.title ?? `Property #${id}`

  return (
    <main className="page-shell dashboard">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Keep track of your property journey in one place.</p>
        </div>
        {isAgent && (
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
          {isAgent && (
            <>
              <a href="#listings">
                <Building2 /> My listings
              </a>
              <a href="#enquiries">
                <Mail /> Enquiries
              </a>
            </>
          )}
          <Link to="/dashboard">
            <UserRound /> Profile
          </Link>
        </aside>
        <div className="dashboard-main">
          <div className="metric-grid">
            {isAgent ? (
              <>
                <Metric
                  icon={<Building2 />}
                  value={mine.data?.count ?? "–"}
                  label="Your listings"
                />
                <Metric
                  icon={<Mail />}
                  value={enquiries.data?.count ?? "–"}
                  label="Enquiries received"
                />
              </>
            ) : (
              <Metric
                icon={<Heart />}
                value={favourites.length}
                label="Saved homes"
              />
            )}
            <Metric
              icon={<KeyRound />}
              value={market.data?.count ?? "–"}
              label="Homes on the market"
            />
          </div>

          {isAgent ? (
            <>
              <section className="dashboard-section" id="listings">
                <div>
                  <h2>Your listings</h2>
                  <Link to="/listings">
                    View all homes <ArrowRight />
                  </Link>
                </div>
                {actionError && (
                  <div className="error" role="alert">
                    {actionError}
                  </div>
                )}
                {mine.error ? (
                  <div className="small-empty">
                    <p>We couldn't load your listings. {mine.error.message}</p>
                    <Button onClick={mine.reload}>Try again</Button>
                  </div>
                ) : !mine.data ? (
                  <p>Loading your listings…</p>
                ) : mine.data.items.length === 0 ? (
                  <div className="small-empty">
                    <Building2 />
                    <p>You haven't listed any homes yet.</p>
                    <Link to="/property/new">Add your first property</Link>
                  </div>
                ) : (
                  mine.data.items.map((p) => (
                    <div className="property-row" key={p.id}>
                      <img src={p.image} alt="" />
                      <div>
                        <b>
                          <Link to={`/property/${p.id}`}>{p.title}</Link>
                          {!p.published && " · Draft"}
                        </b>
                        <span>
                          {p.city} · {formatPrice(p.price)}
                        </span>
                      </div>
                      <div
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <Link className="text-link" to={`/property/${p.id}/edit`}>
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => remove(p.id, p.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </section>

              <section className="dashboard-section" id="enquiries">
                <div>
                  <h2>Recent enquiries</h2>
                </div>
                {enquiries.error ? (
                  <div className="small-empty">
                    <p>
                      We couldn't load your enquiries. {enquiries.error.message}
                    </p>
                    <Button onClick={enquiries.reload}>Try again</Button>
                  </div>
                ) : !enquiries.data ? (
                  <p>Loading enquiries…</p>
                ) : enquiries.data.items.length === 0 ? (
                  <div className="small-empty">
                    <Mail />
                    <p>No enquiries yet. They'll appear here.</p>
                  </div>
                ) : (
                  enquiries.data.items.slice(0, 5).map((q) => (
                    <div
                      className="property-row"
                      key={q.id}
                      style={{ gridTemplateColumns: "1fr" }}
                    >
                      <div>
                        <b>
                          {q.name} ·{" "}
                          <a className="text-link" href={`mailto:${q.email}`}>
                            {q.email}
                          </a>
                          {q.phone ? ` · ${q.phone}` : ""}
                        </b>
                        <span>
                          About {titleFor(q.property)} ·{" "}
                          {new Date(q.created_at).toLocaleDateString()}
                        </span>
                        <p style={{ margin: 0 }}>{q.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </>
          ) : (
            <section className="dashboard-section">
              <div>
                <h2>Recently saved</h2>
                <Link to="/favourites">
                  View all <ArrowRight />
                </Link>
              </div>
              {favouriteHomes.slice(0, 2).map((p) => (
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
              {!saved.loading && !favouriteHomes.length && (
                <div className="small-empty">
                  <Heart />
                  <p>You haven't saved any homes yet.</p>
                  <Link to="/listings">Explore properties</Link>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
