import { ArrowRight, Upload } from "lucide-react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { api } from "../api"
import { Button, Field, Input, Select } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { useListing } from "../hooks/useListings"
import { PROPERTY_TYPES } from "../lib/constants"
import { describeError } from "../lib/errors"
import type { Listing } from "../lib/mapProperty"
import { NotFound } from "./NotFound"

const MAX_IMAGES = 6
const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

/** Add a property (/property/new) or edit one (/property/:id/edit). */
export function PropertyForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const editing = id !== undefined
  const { data, loading, error, reload } = useListing(Number(id), editing)

  let body
  if (!editing) body = <PropertyFormBody key="new" />
  else if (loading && !data)
    body = (
      <div className="empty-state">
        <h2>Loading property…</h2>
      </div>
    )
  else if (error?.status === 404) return <NotFound />
  else if (error || !data)
    body = (
      <div className="empty-state">
        <h2>We couldn't load this property</h2>
        <p>{error?.message}</p>
        <Button onClick={reload}>Try again</Button>
      </div>
    )
  else if (user && user.role !== "admin" && data.ownerId !== user.id)
    body = (
      <div className="empty-state">
        <h2>You can only edit your own listings</h2>
        <Link className="button button-primary" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    )
  else body = <PropertyFormBody key={data.id} listing={data} />

  return (
    <main className="page-shell form-page">
      <Link className="back-link" to="/dashboard">
        ← Back to dashboard
      </Link>
      <div className="page-intro">
        <span className="eyebrow">Agent workspace</span>
        <h1>{editing ? "Edit property." : "Add a property."}</h1>
        <p>Give buyers a clear, complete picture of the home.</p>
      </div>
      {body}
    </main>
  )
}

function PropertyFormBody({ listing }: { listing?: Listing }) {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  // Make a preview for each chosen file, and free the memory when they change.
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  const pickFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked: File[] = Array.from(e.target.files ?? [])
    e.target.value = "" // lets you choose the same file again later
    if (picked.some((f) => !ALLOWED_TYPES.includes(f.type)))
      return setFormError("Only JPEG, PNG and WebP images are supported.")
    if (picked.some((f) => f.size > MAX_BYTES))
      return setFormError("Each image must be 8MB or smaller.")
    if (files.length + picked.length > MAX_IMAGES)
      return setFormError(`You can add up to ${MAX_IMAGES} new images at a time.`)
    setFormError("")
    setFiles([...files, ...picked])
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const text = (key: string) => String(form.get(key) ?? "").trim()
    if (!listing && files.length === 0)
      return setFormError("Please add at least one photo.")

    // Images are sent as files, so this has to be multipart form data.
    const data = new FormData()
    for (const key of [
      "title",
      "description",
      "address",
      "city",
      "property_type",
      "price",
      "bedrooms",
      "bathrooms",
      "area_sqft",
    ])
      data.append(key, text(key))
    const amenities = text("amenities")
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
    data.append("amenities", JSON.stringify(amenities))
    data.append("is_published", form.get("is_published") ? "true" : "false")
    files.forEach((file) => data.append("uploaded_images", file))

    setSaving(true)
    setFormError("")
    try {
      const saved = listing
        ? await api.updateProperty(listing.id, data)
        : await api.createProperty(data)
      navigate(`/property/${saved.id}`)
    } catch (err) {
      setFormError(describeError(err).message)
      setSaving(false)
    }
  }

  return (
    <form className="property-form" onSubmit={submit}>
      <section>
        <h2>Property details</h2>
        <div className="two-col">
          <Field label="Property title">
            <Input name="title" required defaultValue={listing?.title} />
          </Field>
          <Field label="Property type">
            <Select
              name="property_type"
              required
              defaultValue={listing?.type.toLowerCase() ?? ""}
            >
              <option value="">Choose a type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Address">
            <Input name="address" required defaultValue={listing?.location} />
          </Field>
          <Field label="City">
            <Input name="city" required defaultValue={listing?.city} />
          </Field>
          <Field label="Price (£)">
            <Input
              name="price"
              required
              type="number"
              min="1"
              step="any"
              defaultValue={listing?.price}
            />
          </Field>
          <Field label="Floor area (sq ft)">
            <Input
              name="area_sqft"
              required
              type="number"
              min="1"
              defaultValue={listing?.area}
            />
          </Field>
          <Field label="Bedrooms">
            <Input
              name="bedrooms"
              required
              type="number"
              min="0"
              defaultValue={listing?.beds}
            />
          </Field>
          <Field label="Bathrooms">
            <Input
              name="bathrooms"
              required
              type="number"
              min="0"
              defaultValue={listing?.baths}
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            name="description"
            className="field"
            required
            rows={6}
            defaultValue={listing?.description}
          />
        </Field>
        <Field label="Amenities (separate with commas)">
          <Input
            name="amenities"
            placeholder="Garden, Parking, Fireplace"
            defaultValue={listing?.amenities.join(", ")}
          />
        </Field>
        <label
          style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20 }}
        >
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={listing ? listing.published : true}
          />
          Publish this listing (visible to everyone)
        </label>
      </section>
      <section>
        <h2>Property images</h2>
        {listing && listing.images.length > 0 && (
          <>
            <p>Current photos. New uploads are added to these.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {listing.images.map((src) => (
                <img key={src} className="image-preview" src={src} alt="" />
              ))}
            </div>
          </>
        )}
        <label className="upload" style={{ marginTop: 20 }}>
          <Upload />
          <b>{listing ? "Add more photos" : "Upload property photos"}</b>
          <span>
            JPEG, PNG or WebP, up to 8MB each · the first one is the cover photo
          </span>
          <Input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={pickFiles}
          />
        </label>
        {previews.length > 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {previews.map((src, i) => (
              <div key={src}>
                <img className="image-preview" src={src} alt="New upload" />
                <br />
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setFiles(files.filter((_, n) => n !== i))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      {formError && (
        <div className="error" role="alert">
          {formError}
        </div>
      )}
      <div className="form-actions">
        <Link className="button button-ghost" to="/dashboard">
          Cancel
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : listing ? "Save changes" : "Publish property"}{" "}
          <ArrowRight />
        </Button>
      </div>
    </form>
  )
}
