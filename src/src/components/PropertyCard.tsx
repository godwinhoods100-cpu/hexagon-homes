import { Bath, BedDouble, Heart, MapPin, Square } from "lucide-react"
import { Link } from "react-router-dom"
import { formatPrice } from "../lib/format"
import type { Property } from "../types"
import { Button } from "./ui"

export function PropertyCard({
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
