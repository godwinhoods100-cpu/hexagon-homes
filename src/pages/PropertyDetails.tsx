import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Check,
  Heart,
  MapPin,
  Square,
} from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Input } from "../components/ui"
import { useListing } from "../hooks/useListings"
import { formatPrice } from "../lib/format"
import { NotFound } from "./NotFound"

export function PropertyDetails({
  favourites,
  toggleFavourite,
}: {
  favourites: number[]
  toggleFavourite: (id: number) => void
}) {
  const { id } = useParams()
  const { data: property, loading, error, reload } = useListing(Number(id))
  const [sent, setSent] = useState(false)
  if (loading && !property)
    return (
      <main className="details-page">
        <div className="empty-state">
          <h2>Loading property…</h2>
        </div>
      </main>
    )
  if (error?.status === 404) return <NotFound />
  if (error || !property)
    return (
      <main className="details-page">
        <div className="empty-state">
          <h2>We couldn't load this property</h2>
          <p>{error?.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      </main>
    )
  const agentName = property.ownerName
  const firstName = agentName.split(" ")[0]
  const initials = agentName
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <main className="details-page">
      <div className="details-head">
        <div>
          <Link className="back-link" to="/listings">
            ← Back to properties
          </Link>
          <h1>{property.title}</h1>
          <p>
            <MapPin size={16} /> {property.location}, {property.city}
          </p>
        </div>
        <div>
          <span>Guide price</span>
          <b>{formatPrice(property.price)}</b>
        </div>
      </div>
      <div
        className="gallery"
        style={
          property.images.length < 2 ? { gridTemplateColumns: "1fr" } : undefined
        }
      >
        {(property.images.length ? property.images : [property.image])
          .slice(0, 3)
          .map((src, i) => (
            <img key={src} src={src} alt={`${property.title} photo ${i + 1}`} />
          ))}
      </div>
      <div className="details-layout">
        <div className="details-content">
          <div className="key-facts">
            <span>
              <BedDouble /> <b>{property.beds}</b> Bedrooms
            </span>
            <span>
              <Bath /> <b>{property.baths}</b> Bathrooms
            </span>
            <span>
              <Square /> <b>{property.area.toLocaleString()}</b> Sq ft
            </span>
            <span>
              <Building2 /> <b>{property.type}</b> Type
            </span>
          </div>
          <section>
            <span className="eyebrow">The property</span>
            <h2>Considered living, beautifully resolved.</h2>
            <p className="lead">{property.description}</p>
          </section>
          <section>
            <h2>Features & amenities</h2>
            <div className="amenities">
              {property.amenities.map((a) => (
                <span key={a}>
                  <Check />
                  {a}
                </span>
              ))}
            </div>
          </section>
        </div>
        <aside className="agent-card">
          <div className="agent">
            <span>{initials}</span>
            <div>
              <b>{agentName}</b>
              <small>Listing agent</small>
            </div>
          </div>
          <p>
            Interested in this home? {firstName} can answer your questions or
            arrange a private viewing.
          </p>
          {sent ? (
            <div className="success">
              <Check /> Thanks — {firstName} will be in touch shortly.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <Input required placeholder="Your name" />
              <Input required type="email" placeholder="Email address" />
              <Input required placeholder="Phone number" />
              <textarea
                className="field"
                required
                defaultValue={`I'm interested in ${property.title}.`}
              />
              <Button type="submit">
                Request a viewing <ArrowRight size={17} />
              </Button>
            </form>
          )}
          <Button
            variant="secondary"
            className="full"
            onClick={() => toggleFavourite(property.id)}
          >
            <Heart
              size={17}
              fill={favourites.includes(property.id) ? "currentColor" : "none"}
            />{" "}
            {favourites.includes(property.id)
              ? "Saved to favourites"
              : "Save this home"}
          </Button>
        </aside>
      </div>
    </main>
  )
}
