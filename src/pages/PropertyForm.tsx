import { ArrowRight, Check, Upload } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Field, Input, Select } from "../components/ui"

export function PropertyForm() {
  const [preview, setPreview] = useState<string>()
  const [saved, setSaved] = useState(false)
  return (
    <main className="page-shell form-page">
      <Link className="back-link" to="/dashboard">
        ← Back to dashboard
      </Link>
      <div className="page-intro">
        <span className="eyebrow">Agent workspace</span>
        <h1>Add a property.</h1>
        <p>Give buyers a clear, complete picture of the home.</p>
      </div>
      {saved ? (
        <div className="success large">
          <Check />
          <div>
            <h2>Property submitted</h2>
            <p>Your listing has been saved and is ready for moderation.</p>
            <Link className="button button-primary" to="/dashboard">
              Return to dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form
          className="property-form"
          onSubmit={(e) => {
            e.preventDefault()
            setSaved(true)
          }}
        >
          <section>
            <h2>Property details</h2>
            <div className="two-col">
              <Field label="Property title">
                <Input required />
              </Field>
              <Field label="Property type">
                <Select required>
                  <option value="">Choose a type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Cottage</option>
                </Select>
              </Field>
              <Field label="Location">
                <Input required />
              </Field>
              <Field label="City">
                <Input required />
              </Field>
              <Field label="Price (£)">
                <Input required type="number" min="1" />
              </Field>
              <Field label="Floor area (sq ft)">
                <Input required type="number" min="1" />
              </Field>
              <Field label="Bedrooms">
                <Input required type="number" min="0" />
              </Field>
              <Field label="Bathrooms">
                <Input required type="number" min="0" />
              </Field>
            </div>
            <Field label="Description">
              <textarea className="field" required rows={6} />
            </Field>
          </section>
          <section>
            <h2>Property images</h2>
            <label className="upload">
              <Upload />
              <b>Upload property image</b>
              <span>JPEG, PNG or WebP, up to 8MB</span>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setPreview(URL.createObjectURL(file))
                }}
              />
            </label>
            {preview && (
              <img
                className="image-preview"
                src={preview}
                alt="Property preview"
              />
            )}
          </section>
          <div className="form-actions">
            <Link className="button button-ghost" to="/dashboard">
              Cancel
            </Link>
            <Button type="submit">
              Submit property <ArrowRight />
            </Button>
          </div>
        </form>
      )}
    </main>
  )
}
