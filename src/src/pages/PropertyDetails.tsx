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
import { photos, properties } from "../data/sampleProperties"
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
  const property = properties.find((p) => p.id === Number(id))
  const [sent, setSent] = useState(false)
  if (!property) return <NotFound />
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
      <div className="gallery">
        <img src={property.image} alt={property.title} />
        <img
          src={photos[(property.id + 1) % photos.length]}
          alt={`${property.title} interior`}
        />
        <img
          src={photos[(property.id + 2) % photos.length]}
          alt={`${property.title} detail`}
        />
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
            <span>EM</span>
            <div>
              <b>Elena Morris</b>
              <small>Senior Property Partner</small>
            </div>
          </div>
          <p>
            Interested in this home? Elena can answer your questions or arrange
            a private viewing.
          </p>
          {sent ? (
            <div className="success">
              <Check /> Thanks — Elena will be in touch shortly.
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
