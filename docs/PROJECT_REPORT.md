# Hexagon Homes project report

## Objective and problem

Property search products often separate attractive discovery from practical transaction management. Hexagon Homes provides one cohesive, trustworthy experience for buyers, agents and administrators: discover a home, save it, ask questions and manage the listing through a secure account.

## Requirements and solution

The platform implements responsive discovery and detail pages, filterable listings, favourites, inquiries, profiles and owner-restricted listing management. A React SPA communicates with a versioned Django REST surface. JWT authentication keeps API consumers stateless while refresh rotation and blacklisting support secure sessions.

## UX and implementation

The interface uses a restrained navy, ivory and blue identity, clear editorial typography, strong photography and consistent reusable cards, forms and actions. Desktop and mobile layouts prioritize search and keep details legible. Empty, validation, success and missing-route states make outcomes explicit.

Django models reflect the relational domain and serializers provide a second validation boundary. Permissions are split between collection-level role checks and object-level ownership checks. Search, field filters, ordering and pagination are handled by DRF.

## Security

No plaintext passwords or secrets are stored. Admin self-registration is denied. Short-lived access tokens, rotating refresh tokens, server-side ownership checks, CORS allowlists, upload limits and production HTTPS headers reduce common risk. Frontend route guards are convenience only; the API remains authoritative.

## Testing and challenges

API tests target the highest-risk boundaries: identity, ownership, role checks, upload handling and uniqueness. The UI currently uses sample data while the production API client and backend are delivered separately. Hosted PostgreSQL and durable object storage require deployment accounts and are therefore deployment-time integrations.

## Conclusion

Hexagon Homes establishes a maintainable full-stack foundation with polished discovery, secure management workflows, documented APIs, relational integrity and deployment-ready environment configuration.
