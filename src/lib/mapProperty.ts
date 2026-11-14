import type { Property } from "../types"

/** What the Django API sends for one image. */
export type ApiImage = {
  id: number
  url: string
  alt_text: string
  is_primary: boolean
}

/** What the Django API sends for one property. */
export type ApiProperty = {
  id: number
  owner: number
  owner_name: string
  title: string
  description: string
  address: string
  city: string
  property_type: string
  price: string // Django sends decimals as text, e.g. "580000.00"
  bedrooms: number
  bathrooms: number
  area_sqft: number
  amenities: string[]
  is_published: boolean
  images: ApiImage[]
  created_at: string
  updated_at: string
}

/** Every list endpoint is paginated like this. */
export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/** The shape the pages use: the old Property plus a few API-only fields. */
export type Listing = Property & {
  published: boolean
  images: string[]
  ownerId: number
  ownerName: string
}

const NO_PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#e9e6df"/><text x="50%" y="50%" fill="#8a8578" font-family="sans-serif" font-size="40" text-anchor="middle">No photo yet</text></svg>`,
  )

/** Turn an API property into the shape the UI components expect. */
export function mapProperty(p: ApiProperty): Listing {
  const images = [...p.images]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .map((img) => img.url)
  return {
    id: p.id,
    title: p.title,
    location: p.address,
    city: p.city,
    price: Number(p.price),
    type: p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1),
    beds: p.bedrooms,
    baths: p.bathrooms,
    area: p.area_sqft,
    image: images[0] ?? NO_PHOTO,
    description: p.description,
    amenities: p.amenities ?? [],
    published: p.is_published,
    images,
    ownerId: p.owner,
    ownerName: p.owner_name || "Hexagon agent",
  }
}
