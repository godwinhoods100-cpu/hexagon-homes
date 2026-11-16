# Hexagon Homes: Project Report

**Project:** Real Estate Management Platform
**Prepared by:** Godwin Dominic Unyime
**Course / institution:** Web development Hexagon tech
**Date:** November 2026

| | |
|---|---|
| Live website | https://hexagon-homes.vercel.app |
| Live API | https://hexagon-homes.onrender.com/api/ |
| API documentation | https://hexagon-homes.onrender.com/api/docs/ |
| Repository | https://github.com/godwinhoods100-cpu/hexagon-homes |

## 1. Introduction and objectives

Property search tools often separate attractive discovery from practical follow-up. Hexagon Homes joins them in one secure platform where buyers can browse and shortlist homes and contact an agent, and agents can publish and manage their own listings.

The objectives were to:
1. Build a modern, responsive property listing platform with the minimum features in the brief.
2. Use a React front end with a Django REST Framework back end, JWT authentication, role-based authorization and a relational PostgreSQL database.
3. Support image upload with durable storage.
4. Deploy the platform online and document it.

## 2. Requirements and how they were met

| Requirement | Implementation |
|---|---|
| User authentication | Registration, login, logout, profile; JWT access and rotating refresh tokens |
| Property listings | Paginated listings page and Home page, loaded from the API |
| Property details | Dynamic route `/property/:id` with gallery, key facts, amenities and the listing agent |
| Image upload | Agents upload up to 6 JPEG, PNG or WebP photos (8 MB each) per save, with previews; stored on Cloudinary |
| Property search | Keyword search across title, description, address and city, handled by the server |
| Filter by price | Maximum-price filter, plus price sorting (`price__lte`, `ordering`) |
| Filter by location | City filter with suggestions (`city__icontains`) |
| Save favourite properties | Stored per account; duplicate saves blocked by a database constraint |
| Contact agent | Validated enquiry form saved to the database and shown in the agent's inbox |
| React, React Router, components | Component-based single-page app with nested pages and a route guard |
| Responsive design | Fluid layouts and a mobile navigation menu that adapt from phone to desktop widths |
| Form validation | Client-side checks on the enquiry, property and authentication forms, with server errors displayed |
| API integration, loading and error states | One API client, data hooks, loading placeholders, error messages with a Try again button |
| Django, DRF, REST, CRUD | Properties: create, read, update, delete. Favourites and enquiries: create, read, delete / read |
| JWT, protected routes, roles | Route guards in the app; permission classes in the API (visitor, buyer, agent, admin) |
| Model relationships, foreign keys, validation | Five related models, explicit delete rules, unique and indexed fields, serializer and model validators |
| Deployment | Frontend on Vercel, backend and PostgreSQL on Render, photos on Cloudinary |
| Bonus: pagination | Server-side pagination (12 per page) with Previous and Next controls |

## 3. System design

The system is a single-page React application that talks to a Django REST API over HTTPS. The API stores data in PostgreSQL and photos on Cloudinary. See `docs/ARCHITECTURE.md` for the component diagram, request flow and the ER diagram.

**Database.** Five tables: `User`, `Property`, `PropertyImage`, `Favourite` and `Inquiry`. A user owns many properties; a property has many images, favourites and enquiries. A unique constraint prevents saving the same home twice. City, type and price are indexed for the filters. Enquiries keep their sender as optional so a record survives if the account is deleted.

**API.** Resources are exposed as REST endpoints under `/api/`, documented automatically with OpenAPI and Swagger. Listing queries support search, filters, ordering and pagination.

**Security.** Passwords are hashed. Access tokens expire after 15 minutes; refresh tokens rotate and are blacklisted at logout. Every write is checked on the server for role and ownership, admin accounts cannot be self-registered, uploads are limited by type and size, and production uses HTTPS, secure cookies and HSTS. Secrets and allowed origins come from environment variables.

## 4. Implementation highlights

- **API client.** One module attaches the bearer token, retries once after refreshing an expired token, sends JSON or multipart data, and turns server errors into readable messages.
- **Data layer.** Small hooks load listings, a single listing, enquiries and saved homes, expose loading and error state, ignore out-of-date answers when filters change and wait for typing to pause before searching. A mapper converts the API's field names and decimal-as-text prices into the shapes the pages use.
- **Favourites.** The heart updates immediately and is undone with a message if the server refuses. Logged-out visitors are sent to log in and returned to the same page.
- **Agent tools.** One form handles adding and editing, builds the multipart request, previews new photos and shows server validation errors. The dashboard shows live counts, the agent's listings with Edit and Delete, and recent enquiries.
- **Code organisation.** The interface was split into reusable components and page modules so each file has one clear responsibility.

## 5. Deployment

| Part | Service | Notes |
|---|---|---|
| Frontend | Vercel | `pnpm build`; `VITE_API_URL` is read at build time; `vercel.json` routes all paths to the app |
| API | Render web service | Root `backend`; build runs collectstatic and migrations; started with gunicorn |
| Database | Render PostgreSQL | Connected through `DATABASE_URL` |
| Photos | Cloudinary | Needed because Render's disk is wiped on restart; enabled by `CLOUDINARY_URL` |

The frontend and API are on different domains, so the API allows the frontend's origin explicitly (CORS) and trusts it for secure requests.

## 6. Testing

Automated backend tests cover registration, login and logout, case-insensitive email handling, automatic admin role for superusers, public listing and filtering, agent-only creation, owner-only update and delete, duplicate-favourite prevention and a real image upload. Manual acceptance and live smoke tests are listed in `docs/TESTING.md`. Test results from the final run are recorded there.

## 7. Challenges and solutions

| Challenge | Solution |
|---|---|
| Browser blocked calls from the live site to the API | Configure the API's CORS and CSRF origins for the deployed frontend; rebuild the frontend after setting its API address |
| Uploaded photos would vanish on every restart of the free host | Move photo storage to Cloudinary through a small custom Django storage class |
| The API returns prices as text and uses different field names from the interface | One mapper converts every API property; pages stay unchanged |
| One 1,500-line file made the app hard to maintain | Split into components and pages with an automated, behaviour-preserving refactor |
| Filtering and typing caused extra or out-of-order requests | Debounced search input, and data hooks that ignore out-of-date responses |

## 8. Limitations and future work

- Photos can be added but not removed or reordered individually (needs an image-delete endpoint).
- Enquiries cannot yet be marked read or replied to from the dashboard.
- Email verification, password reset, notifications and analytics charts are natural next steps.
- The free hosting plan sleeps when idle, so the first request can take about a minute.

## 9. Conclusion

Hexagon Homes delivers every minimum feature and technical requirement in the brief, plus pagination as a bonus. It is deployed, documented and built on a maintainable structure of reusable components, a layered API, relational integrity and server-enforced security.

## Credits

Demo listing imagery is illustrative artwork used for demonstration only (forest scene by Kiddo). Icons are from Lucide. Built with React, Vite, Tailwind CSS, Django, Django REST Framework, SimpleJWT, django-filter, drf-spectacular, PostgreSQL, Cloudinary, Vercel and Render.
