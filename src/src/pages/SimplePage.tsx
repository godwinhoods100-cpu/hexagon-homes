import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import { Button, Field, Input, SectionHeading, Select } from "../components/ui"
import { photos } from "../data/sampleProperties"

export function SimplePage({ page }: { page: "about" | "contact" }) {
  const [sent, setSent] = useState(false)
  if (page === "about")
    return (
      <main>
        <section className="simple-hero">
          <div>
            <span className="eyebrow light">Our story</span>
            <h1>
              Property is personal.
              <br />
              So are we.
            </h1>
            <p>
              Hexagon Homes was founded on a simple belief: moving home deserves
              more care, clarity and attention.
            </p>
          </div>
          <img src={photos[5]} alt="Thoughtfully designed home" />
        </section>
        <section className="story">
          <SectionHeading
            eyebrow="Since 2011"
            title="Local insight. Wider perspective."
          />
          <div>
            <p className="lead">
              We are an independent team of property specialists, designers and
              neighbourhood experts united by a love of exceptional homes.
            </p>
            <p>
              Our approach combines the reach and rigour of a modern agency with
              the thoughtful, one-to-one service of a trusted local adviser. No
              pressure. No jargon. Just sound advice at every stage.
            </p>
          </div>
        </section>
        <section className="values">
          <SectionHeading
            eyebrow="What guides us"
            title="Designed around people."
            centered
          />
          <div className="steps">
            <div className="step">
              <ShieldCheck />
              <h3>Trust, earned</h3>
              <p>Transparent guidance and honest conversations, always.</p>
            </div>
            <div className="step">
              <Sparkles />
              <h3>Quality, considered</h3>
              <p>High standards in every home, detail and interaction.</p>
            </div>
            <div className="step">
              <UserRound />
              <h3>Service, personal</h3>
              <p>One expert who knows your story from start to finish.</p>
            </div>
          </div>
        </section>
      </main>
    )
  return (
    <main className="contact-page">
      <div>
        <span className="eyebrow">Let's talk</span>
        <h1>Start a conversation.</h1>
        <p>
          Whether you're searching, selling or simply curious about the market,
          our team is ready to help.
        </p>
        <div className="contact-details">
          <span>
            <Mail /> hello@hexagonhomes.co.uk
          </span>
          <span>
            <MapPin /> 18 King Street, London, W1
          </span>
        </div>
      </div>
      {sent ? (
        <div className="success large">
          <Check />
          <div>
            <h2>Message received</h2>
            <p>We’ll be in touch within one working day.</p>
          </div>
        </div>
      ) : (
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <div className="two-col">
            <Field label="First name">
              <Input required />
            </Field>
            <Field label="Last name">
              <Input required />
            </Field>
          </div>
          <Field label="Email address">
            <Input type="email" required />
          </Field>
          <Field label="Phone number">
            <Input type="tel" />
          </Field>
          <Field label="How can we help?">
            <Select>
              <option>I'm looking to buy</option>
              <option>I'd like to sell</option>
              <option>I'd like a valuation</option>
              <option>Something else</option>
            </Select>
          </Field>
          <Field label="Your message">
            <textarea className="field" rows={5} required />
          </Field>
          <Button type="submit">
            Send message <ArrowRight />
          </Button>
        </form>
      )}
    </main>
  )
}
