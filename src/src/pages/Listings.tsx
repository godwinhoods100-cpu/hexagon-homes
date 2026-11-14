import { Search, SlidersHorizontal, X } from "lucide-react"
import { useMemo, useState } from "react"
import { PropertyCard } from "../components/PropertyCard"
import { Button, Input, Select } from "../components/ui"
import { properties } from "../data/sampleProperties"

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
  const [sort, setSort] = useState("featured")
  const results = useMemo(
    () =>
      properties
        .filter(
          (p) =>
            (!search ||
              `${p.title} ${p.location} ${p.city}`
                .toLowerCase()
                .includes(search.toLowerCase())) &&
            (!city || p.city === city) &&
            (!type || p.type === type) &&
            (!beds || p.beds >= Number(beds)) &&
            (!max || p.price <= Number(max)),
        )
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : Number(b.featured) - Number(a.featured),
        ),
    [search, city, type, beds, max, sort],
  )
  const clear = () => {
    setSearch("")
    setCity("")
    setType("")
    setBeds("")
    setMax("")
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keyword or area"
          />
        </div>
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All locations</option>
          {[...new Set(properties.map((p) => p.city))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Property type</option>
          {[...new Set(properties.map((p) => p.type))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <Select value={beds} onChange={(e) => setBeds(e.target.value)}>
          <option value="">Bedrooms</option>
          <option value="2">2+ beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
        </Select>
        <Select value={max} onChange={(e) => setMax(e.target.value)}>
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
          <b>{results.length}</b> homes found
        </span>
        <label>
          Sort by{" "}
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </Select>
        </label>
      </div>
      {results.length ? (
        <div className="property-grid">
          {results.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              favourite={favourites.includes(p.id)}
              onFavourite={toggleFavourite}
            />
          ))}
        </div>
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
