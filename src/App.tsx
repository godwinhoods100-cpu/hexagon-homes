import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  Heart,
  Home as HomeIcon,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react"
import {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  useMemo,
  useState,
} from "react"
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom"

type Property = {
  id: number
  title: string
  location: string
  city: string
  price: number
  type: string
  beds: number
  baths: number
  area: number
  image: string
  featured?: boolean
  description: string
  amenities: string[]
}

type User = { name: string email: string role: "user" | "agent" | "admin" }

const photos = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1707189856923-46dd41ea2bdc?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1762811054947-605b20298615?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1757524508669-e93378568503?auto=format&fit=crop&w=1400&q=85",
]

const properties: Property[] = [
  {
    id: 1,
    title: "The Alder Residence",
    location: "14 Beaumont Crescent",
    city: "London",
    price: 1280000,
    type: "House",
    beds: 4,
    baths: 3,
    area: 2840,
    image: photos[0],
    featured: true,
    description:
      "An exceptional contemporary residence where quiet luxury meets considered architecture. Floor-to-ceiling glass, warm natural materials and landscaped gardens create a private urban retreat.",
    amenities: [
      "Private garden",
      "Designer kitchen",
      "Underfloor heating",
      "EV charging",
      "Home office",
      "Security system",
    ],
  },
  {
    id: 2,
    title: "Azure House",
    location: "82 Marine Parade",
    city: "Brighton",
    price: 875000,
    type: "Villa",
    beds: 3,
    baths: 2,
    area: 1960,
    image: photos[1],
    featured: true,
    description:
      "A light-filled coastal home with uninterrupted sea views, a secluded pool terrace and beautifully resolved interiors.",
    amenities: [
      "Sea view",
      "Swimming pool",
      "Roof terrace",
      "Garage",
      "Smart home",
    ],
  },
  {
    id: 3,
    title: "No. 9 Parkside",
    location: "9 Richmond Avenue",
    city: "Manchester",
    price: 695000,
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: 1510,
    image: photos[2],
    featured: true,
    description:
      "A refined city apartment balancing generous proportions with tactile finishes and direct access to the park.",
    amenities: [
      "Concierge",
      "Balcony",
      "Residents' lounge",
      "Cycle storage",
      "Lift",
    ],
  },
  {
    id: 4,
    title: "Willow Courtyard",
    location: "3 The Paddocks",
    city: "Bristol",
    price: 945000,
    type: "House",
    beds: 4,
    baths: 3,
    area: 2310,
    image: photos[3],
    description:
      "A distinctive family house arranged around a peaceful private courtyard, moments from the city and countryside.",
    amenities: [
      "Courtyard",
      "Garden studio",
      "Utility room",
      "Parking",
      "Fireplace",
    ],
  },
  {
    id: 5,
    title: "Glasshouse Penthouse",
    location: "21 Crown Street",
    city: "Edinburgh",
    price: 1120000,
    type: "Penthouse",
    beds: 3,
    baths: 3,
    area: 2040,
    image: photos[4],
    description:
      "Elevated living with panoramic city views, expansive terraces and effortless access to Edinburgh's cultural heart.",
    amenities: [
      "City views",
      "Two terraces",
      "Private lift",
      "Parking",
      "Concierge",
    ],
  },
  {
    id: 6,
    title: "Fernbank Cottage",
    location: "6 Church Lane",
    city: "Bath",
    price: 580000,
    type: "Cottage",
    beds: 2,
    baths: 2,
    area: 1240,
    image: photos[5],
    description:
      "A thoughtfully renewed period cottage filled with character, calm and beautifully crafted modern details.",
    amenities: ["Period features", "Garden", "Wood burner", "Bespoke joinery"],
  },
]

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price)

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "light"
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field ${props.className || ""}`} {...props} />
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`field ${props.className || ""}`} {...props} />
}

function Field({ label, children }: { label: string children: ReactNode }) {
  return (
    <label className="field-group">
      <span>{label}</span>
      {children}
    </label>
  )
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  centered = false,
}: {
  eyebrow: string
  title: string
  copy?: string
  centered?: boolean
}) {
  return (
    <div className={`section-heading ${centered ? "centered" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Hexagon Homes home">
      <span className="brand-mark">
        <HomeIcon size={18} strokeWidth={2.2} />
      </span>
      <span>
        HEXAGON <b>HOMES</b>
      </span>
    </Link>
  )
}

function Navbar({
  user,
  onLogout,
}: {
  user: User | null
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Brand />
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <NavLink to="/" onClick={close}>
            Home
          </NavLink>
          <NavLink to="/listings" onClick={close}>
            Properties
          </NavLink>
          <NavLink to="/about" onClick={close}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={close}>
            Contact
          </NavLink>
          <div className="mobile-actions">
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={close}>
                  Dashboard
                </NavLink>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogout()
                    close()
                  }}
                >
                  <LogOut size={16} /> Log out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={close}>
                  Log in
                </NavLink>
                <Link
                  className="button button-primary"
                  to="/signup"
                  onClick={close}
                >
                  Join Hexagon
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <Link
                className="icon-link"
                to="/favourites"
                aria-label="Favourites"
              >
                <Heart size={19} />
              </Link>
              <Link className="avatar" to="/dashboard">
                {user.name.charAt(0)}
              </Link>
            </>
          ) : (
            <>
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Link className="button button-primary compact" to="/signup">
                Join Hexagon
              </Link>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          className="menu-button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Exceptional homes. Trusted expertise.
            <br />A more considered way to move.
          </p>
        </div>
        <div>
          <b>Explore</b>
          <Link to="/listings">Properties</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <b>For owners</b>
          <Link to="/signup">List a property</Link>
          <Link to="/dashboard">Agent dashboard</Link>
          <Link to="/contact">Valuations</Link>
        </div>
        <div>
          <b>Stay informed</b>
          <p>New homes and market notes, thoughtfully selected.</p>
          <div className="subscribe">
            <Input
              type="email"
              aria-label="Email address"
              placeholder="Email address"
            />
            <Button aria-label="Subscribe">
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Hexagon Homes</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  )
}

function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(
      `/listings?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`,
    )
  }
  return (
    <form className="hero-search" onSubmit={submit}>
      <Field label="I'm looking for">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="House, apartment, cottage..."
        />
      </Field>
      <Field label="Where">
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Any location</option>
          {[
            "London",
            "Brighton",
            "Manchester",
            "Bristol",
            "Edinburgh",
            "Bath",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Button type="submit">
        <Search size={18} /> Find a home
      </Button>
    </form>
  )
}

function PropertyCard({
  property,
  favourite,
  onFavourite,
}: {
  property: Property
  favourite: boolean
  onFavourite: (id: number) => void
}) {
  return (
    <article className="property-card">
      <div className="property-image">
        <img src={property.image} alt={property.title} />
        {property.featured && <span className="property-tag">Featured</span>}
        <Button
          variant="light"
          className={favourite ? "favourite active" : "favourite"}
          onClick={() => onFavourite(property.id)}
          aria-label="Toggle favourite"
        >
          <Heart size={18} fill={favourite ? "currentColor" : "none"} />
        </Button>
      </div>
      <div className="property-body">
        <div className="property-price">{formatPrice(property.price)}</div>
        <h3>
          <Link to={`/property/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="location">
          <MapPin size={15} />
          {property.location}, {property.city}
        </p>
        <div className="property-specs">
          <span>
            <BedDouble size={17} /> {property.beds} beds
          </span>
          <span>
            <Bath size={17} /> {property.baths} baths
          </span>
          <span>
            <Square size={16} /> {property.area.toLocaleString()} sq ft
          </span>
        </div>
      </div>
    </article>
  )
}

function Home({
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

function Listings({
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

function PropertyDetails({
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

function AuthPage({
  mode,
  onLogin,
}: {
  mode: "login" | "signup"
  onLogin: (user: User) => void
}) {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))
    if (!email.includes("@") || password.length < 8)
      return setError(
        "Enter a valid email and a password of at least 8 characters.",
      )
    const name = String(form.get("name") || email.split("@")[0])
    onLogin({
      name,
      email,
      role:
        mode === "signup" && form.get("role") === "agent" ? "agent" : "user",
    })
    navigate("/dashboard")
  }
  return (
    <main className="auth-page">
      <div className="auth-image">
        <img src={photos[2]} alt="Modern home" />
        <blockquote>
          “The right home changes more than your address.”
        </blockquote>
      </div>
      <div className="auth-panel">
        <Brand />
        <div className="auth-form">
          <span className="eyebrow">
            {mode === "login" ? "Welcome back" : "Join Hexagon"}
          </span>
          <h1>
            {mode === "login" ? "Good to see you." : "Create your account."}
          </h1>
          <p>
            {mode === "login"
              ? "Log in to manage your saved homes and enquiries."
              : "Save favourites, contact agents and manage your property journey."}
          </p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            {mode === "signup" && (
              <>
                <Field label="Full name">
                  <Input name="name" required autoComplete="name" />
                </Field>
                <Field label="I am a">
                  <Select name="role">
                    <option value="user">Buyer or renter</option>
                    <option value="agent">Property agent</option>
                  </Select>
                </Field>
              </>
            )}
            <Field label="Email address">
              <Input name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Password">
              <Input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </Field>
            <Button type="submit">
              {mode === "login" ? "Log in" : "Create account"}{" "}
              <ArrowRight size={17} />
            </Button>
          </form>
          <p className="auth-switch">
            {mode === "login" ? "New to Hexagon?" : "Already have an account?"}{" "}
            <Link to={mode === "login" ? "/signup" : "/login"}>
              {mode === "login" ? "Create an account" : "Log in"}
            </Link>
          </p>
          <small>
            Demo mode stores your session only in this browser. Production
            authentication connects through the included JWT API.
          </small>
        </div>
      </div>
    </main>
  )
}

function Dashboard({ user, favourites }: { user: User favourites: number[] }) {
  const favouriteHomes = properties.filter((p) => favourites.includes(p.id))
  return (
    <main className="page-shell dashboard">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Keep track of your property journey in one place.</p>
        </div>
        {user.role === "agent" && (
          <Link className="button button-primary" to="/property/new">
            <Plus size={17} /> Add property
          </Link>
        )}
      </div>
      <div className="dashboard-grid">
        <aside className="dashboard-nav">
          <Link className="active" to="/dashboard">
            <HomeIcon /> Overview
          </Link>
          <Link to="/favourites">
            <Heart /> Favourites
          </Link>
          {user.role === "agent" && (
            <>
              <Link to="/dashboard">
                <Building2 /> My listings
              </Link>
              <Link to="/dashboard">
                <Mail /> Enquiries
              </Link>
            </>
          )}
          <Link to="/dashboard">
            <UserRound /> Profile
          </Link>
        </aside>
        <div className="dashboard-main">
          <div className="metric-grid">
            <div>
              <Heart />
              <b>{favourites.length}</b>
              <span>Saved homes</span>
            </div>
            <div>
              <Mail />
              <b>2</b>
              <span>Open enquiries</span>
            </div>
            <div>
              <KeyRound />
              <b>1</b>
              <span>Upcoming viewing</span>
            </div>
          </div>
          <section className="dashboard-section">
            <div>
              <h2>
                {user.role === "agent" ? "Your listings" : "Recently saved"}
              </h2>
              <Link to={user.role === "agent" ? "/listings" : "/favourites"}>
                View all <ArrowRight />
              </Link>
            </div>
            {(user.role === "agent"
              ? properties.slice(0, 2)
              : favouriteHomes.slice(0, 2)
            ).map((p) => (
              <div className="property-row" key={p.id}>
                <img src={p.image} alt="" />
                <div>
                  <b>{p.title}</b>
                  <span>
                    {p.city} · {formatPrice(p.price)}
                  </span>
                </div>
                <Link to={`/property/${p.id}`}>
                  <ChevronRight />
                </Link>
              </div>
            ))}
            {user.role !== "agent" && !favouriteHomes.length && (
              <div className="small-empty">
                <Heart />
                <p>You haven't saved any homes yet.</p>
                <Link to="/listings">Explore properties</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function PropertyForm() {
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

function Favourites({
  favourites,
  toggleFavourite,
}: {
  favourites: number[]
  toggleFavourite: (id: number) => void
}) {
  const items = properties.filter((p) => favourites.includes(p.id))
  return (
    <main className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">Your collection</span>
        <h1>Saved homes.</h1>
        <p>A shortlist of places that caught your eye.</p>
      </div>
      {items.length ? (
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

function SimplePage({ page }: { page: "about" | "contact" }) {
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

function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>This address doesn't feel like home.</h1>
      <p>The page may have moved, or the link might be out of date.</p>
      <Link className="button button-primary" to="/">
        Return home
      </Link>
    </main>
  )
}

function AppShell() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("hh-user") || "null")
    } catch {
      return null
    }
  })
  const [favourites, setFavourites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hh-favourites") || "[]")
    } catch {
      return []
    }
  })
  const login = (next: User) => {
    setUser(next)
    localStorage.setItem("hh-user", JSON.stringify(next))
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem("hh-user")
  }
  const toggleFavourite = (id: number) =>
    setFavourites((current) => {
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
      localStorage.setItem("hh-favourites", JSON.stringify(next))
      return next
    })
  return (
    <div className="app">
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            <Home favourites={favourites} toggleFavourite={toggleFavourite} />
          }
        />
        <Route
          path="/listings"
          element={
            <Listings
              favourites={favourites}
              toggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/property/:id"
          element={
            <PropertyDetails
              favourites={favourites}
              toggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/login"
          element={<AuthPage mode="login" onLogin={login} />}
        />
        <Route
          path="/signup"
          element={<AuthPage mode="signup" onLogin={login} />}
        />
        <Route path="/about" element={<SimplePage page="about" />} />
        <Route path="/contact" element={<SimplePage page="contact" />} />
        <Route
          path="/favourites"
          element={
            user ? (
              <Favourites
                favourites={favourites}
                toggleFavourite={toggleFavourite}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} favourites={favourites} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/property/new"
          element={
            user?.role === "agent" || user?.role === "admin" ? (
              <PropertyForm />
            ) : (
              <Navigate to={user ? "/dashboard" : "/login"} />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
