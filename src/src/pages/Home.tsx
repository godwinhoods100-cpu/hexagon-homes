import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import { Link } from "react-router-dom"
import { PropertyCard } from "../components/PropertyCard"
import { SearchBar } from "../components/SearchBar"
import { SectionHeading } from "../components/ui"
import { photos, properties } from "../data/sampleProperties"

export function Home({
  favourites,
  toggleFavourite,
}: {
  favourites: number[]
  toggleFavourite: (id: number) => void
}) {
  return (
    <>
      <main>
        <section className="hero">
          <img src={photos[0]} alt="Contemporary luxury home" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-kicker">
              A considered approach to property
            </span>
            <h1>
              Find a home that
              <br />
              <em>feels like you.</em>
            </h1>
            <p>
              Exceptional properties, local expertise and a refreshingly
              personal service.
            </p>
            <SearchBar />
          </div>
          <div className="hero-stat">
            <b>4.9</b>
            <span>
              Rated excellent
              <br />
              by our clients
            </span>
          </div>
        </section>
        <section className="section">
          <div className="section-top">
            <SectionHeading
              eyebrow="Curated for you"
              title="Homes worth discovering"
              copy="A selection of distinctive properties, chosen for their design, setting and character."
            />
            <Link className="text-link" to="/listings">
              View all properties <ArrowRight size={17} />
            </Link>
          </div>
          <div className="property-grid">
            {properties.slice(0, 3).map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                favourite={favourites.includes(p.id)}
                onFavourite={toggleFavourite}
              />
            ))}
          </div>
        </section>
        <section className="category-section">
          <SectionHeading
            eyebrow="Explore by lifestyle"
            title="Where life takes shape"
            centered
          />
          <div className="category-grid">
            {[
              { name: "City living", count: 48, img: photos[4] },
              { name: "Coastal escapes", count: 26, img: photos[1] },
              { name: "Country homes", count: 34, img: photos[5] },
            ].map((c) => (
              <Link
                to={`/listings?q=${c.name}`}
                className="category"
                key={c.name}
              >
                <img src={c.img} alt="" />
                <span>
                  <b>{c.name}</b>
                  <small>{c.count} properties</small>
                </span>
                <ChevronRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="why-section">
          <div className="why-image">
            <img src={photos[3]} alt="Modern home at dusk" />
            <div className="experience">
              <b>15+</b>
              <span>
                years of
                <br />
                local expertise
              </span>
            </div>
          </div>
          <div className="why-copy">
            <SectionHeading
              eyebrow="Why Hexagon"
              title="Property, made personal."
              copy="We combine deep local knowledge, considered technology and genuine human care to make every move feel simpler."
            />
            <div className="benefits">
              {[
                {
                  icon: <Sparkles />,
                  title: "Remarkable homes",
                  text: "Every listing is carefully reviewed for quality, character and value.",
                },
                {
                  icon: <UserRound />,
                  title: "People-first service",
                  text: "One dedicated expert, with you from first viewing to final key.",
                },
                {
                  icon: <ShieldCheck />,
                  title: "Trusted expertise",
                  text: "Clear advice and honest communication, backed by proven experience.",
                },
              ].map((x) => (
                <div className="benefit" key={x.title}>
                  <span>{x.icon}</span>
                  <div>
                    <b>{x.title}</b>
                    <p>{x.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link className="button button-secondary" to="/about">
              Discover our approach <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <section className="steps-section">
          <SectionHeading
            eyebrow="A simpler move"
            title="From search to sold, beautifully simple."
            centered
          />
          <div className="steps">
            {[
              {
                n: "01",
                title: "Discover",
                text: "Search a curated collection of homes that suit your life.",
              },
              {
                n: "02",
                title: "Connect",
                text: "Speak directly with a local property expert who understands.",
              },
              {
                n: "03",
                title: "Move",
                text: "We coordinate every detail, right through to key handover.",
              },
            ].map((s) => (
              <div className="step" key={s.n}>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="cta">
          <div>
            <span className="eyebrow light">Thinking of selling?</span>
            <h2>
              Your next chapter
              <br />
              starts with a conversation.
            </h2>
            <p>
              Request a complimentary, no-obligation valuation with one of our
              local experts.
            </p>
          </div>
          <Link className="button button-light" to="/contact">
            Book a valuation <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    </>
  )
}
