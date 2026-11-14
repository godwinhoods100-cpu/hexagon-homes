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
import { FormEvent, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Input } from "../components/ui"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import { describeError } from "../lib/errors"
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
  const { user } = useAuth()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState("")
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

  const sendEnquiry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get("name") || "").trim()
    const email = String(form.get("email") || "").trim()
    const phone = String(form.get("phone") || "").trim()
    const message = String(form.get("message") || "").trim()
    if (name.length < 2) return setFormError("Please enter your name.")
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setFormError("Please enter a valid email address.")
    if (phone && !/^[+\d][\d\s()-]{6,}$/.test(phone))
      return setFormError("Please enter a valid phone number, or leave it blank.")
    if (message.length < 10)
      return setFormError("Your message should be at least 10 characters.")
    setFormError("")
    setSending(true)
    try {
      await api.inquiry({ property: property.id, name, email, phone, message })
      setSent(true)
    } catch (err) {
      setFormError(describeError(err).message)
    } finally {
      setSending(false)
    }
  }

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
          {user && (user.role === "admin" || user.id === property.ownerId) && (
            <Link
              className="button button-secondary"
              to={`/property/${property.id}/edit`}
            >
              Edit property
            </Link>
          )}
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
            <form onSubmit={sendEnquiry} noValidate>
              <Input
                name="name"
                placeholder="Your name"
                defaultValue={user?.name ?? ""}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                defaultValue={user?.email ?? ""}
              />
              <Input name="phone" placeholder="Phone number (optional)" />
              <textarea
                name="message"
                className="field"
                defaultValue={`I'm interested in ${property.title}.`}
              />
              {formError && (
                <div className="error" role="alert">
                  {formError}
                </div>
              )}
              <Button type="submit" disabled={sending}>
                {sending ? "Sending…" : "Request a viewing"}{" "}
                <ArrowRight size={17} />
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
