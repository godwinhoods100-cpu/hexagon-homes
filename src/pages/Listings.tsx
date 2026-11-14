import { Search, SlidersHorizontal, X } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { PropertyCard } from "../components/PropertyCard"
import { Button, Input, Select } from "../components/ui"
import { useDebounce, useListings } from "../hooks/useListings"
import { CITIES, PAGE_SIZE, PROPERTY_TYPES } from "../lib/constants"

export function Listings({
  favourites,
  toggleFavourite,
}: {
  favourites: number[]
  toggleFavourite: (id: number) => void
}) {
  const params = new URLSearchParams(location.search)
  const [search, setSearch] = useState(params.get("q") || "")
  const [city, setCity] = useState(params.get("city") || "")
  const [type, setType] = useState("")
  const [beds, setBeds] = useState("")
  const [max, setMax] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)

  // Wait until the person stops typing before asking the server.
  const debouncedSearch = useDebounce(search)
  const debouncedCity = useDebounce(city)

  // The filters become a query string the Django API understands.
  const query = new URLSearchParams()
  if (debouncedSearch) query.set("search", debouncedSearch)
  if (debouncedCity) query.set("city__icontains", debouncedCity)
  if (type) query.set("property_type", type)
  if (beds) query.set("bedrooms__gte", beds)
  if (max) query.set("price__lte", max)
  query.set(
    "ordering",
    sort === "low" ? "price" : sort === "high" ? "-price" : "-created_at",
  )
  if (page > 1) query.set("page", String(page))

  const { data, loading, error, reload } = useListings(query.toString())
  const items = data?.items ?? []
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE))

  // Changing any filter sends you back to page 1.
  const change =
    (set: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      set(e.target.value)
      setPage(1)
    }
  const clear = () => {
    setSearch("")
    setCity("")
    setType("")
    setBeds("")
    setMax("")
    setPage(1)
  }
  const goTo = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">Property collection</span>
        <h1>Find your place.</h1>
        <p>
          Explore exceptional homes across the UK, selected for how they live as
          much as how they look.
        </p>
      </div>
      <div className="filters">
        <div className="filter-search">
          <Search size={18} />
          <Input
            value={search}
            onChange={change(setSearch)}
            placeholder="Search by keyword or area"
          />
        </div>
        <Input
          value={city}
          onChange={change(setCity)}
          placeholder="Any location"
          list="city-suggestions"
        />
        <datalist id="city-suggestions">
          {CITIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <Select value={type} onChange={change(setType)}>
          <option value="">Property type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </Select>
        <Select value={beds} onChange={change(setBeds)}>
          <option value="">Bedrooms</option>
          <option value="2">2+ beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
        </Select>
        <Select value={max} onChange={change(setMax)}>
          <option value="">Max price</option>
          <option value="600000">£600k</option>
          <option value="900000">£900k</option>
          <option value="1200000">£1.2m</option>
        </Select>
        <Button variant="ghost" onClick={clear}>
          <X size={16} /> Clear
        </Button>
      </div>
      <div className="results-bar">
        <span>
          {data ? (
            <>
              <b>{data.count}</b> homes found
            </>
          ) : (
            "Searching…"
          )}
        </span>
        <label>
          Sort by{" "}
          <Select value={sort} onChange={change(setSort)}>
            <option value="newest">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </Select>
        </label>
      </div>
      {error ? (
        <div className="empty-state">
          <SlidersHorizontal />
          <h2>We couldn't load the homes</h2>
          <p>{error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      ) : !data ? (
        <div className="empty-state">
          <SlidersHorizontal />
          <h2>Loading homes…</h2>
        </div>
      ) : items.length ? (
        <>
          <div
            className="property-grid"
            style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            {items.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                favourite={favourites.includes(p.id)}
                onFavourite={toggleFavourite}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                marginTop: 48,
              }}
            >
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => goTo(page - 1)}
              >
                ← Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => goTo(page + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <SlidersHorizontal />
          <h2>No homes match those filters</h2>
          <p>Try widening your search or clearing the filters.</p>
          <Button onClick={clear}>Clear all filters</Button>
        </div>
      )}
    </main>
  )
}
