import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { PropertyCard } from "../components/PropertyCard"
import { Button } from "../components/ui"
import { useListingsByIds } from "../hooks/useListings"

export function Favourites({
  favourites,
  toggleFavourite,
}: {
  favourites: number[]
  toggleFavourite: (id: number) => void
}) {
  const { data, loading, error, reload } = useListingsByIds(favourites)
  // filter here too so a removed home disappears straight away
  const items = (data ?? []).filter((p) => favourites.includes(p.id))
  return (
    <main className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">Your collection</span>
        <h1>Saved homes.</h1>
        <p>A shortlist of places that caught your eye.</p>
      </div>
      {error ? (
        <div className="empty-state">
          <Heart />
          <h2>We couldn't load your saved homes</h2>
          <p>{error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      ) : loading && !data ? (
        <div className="empty-state">
          <Heart />
          <h2>Loading your saved homes…</h2>
        </div>
      ) : items.length ? (
        <div className="property-grid">
          {items.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              favourite
              onFavourite={toggleFavourite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart />
          <h2>No saved homes yet</h2>
          <p>Tap the heart on any property to build your shortlist.</p>
          <Link className="button button-primary" to="/listings">
            Explore properties
          </Link>
        </div>
      )}
    </main>
  )
}
