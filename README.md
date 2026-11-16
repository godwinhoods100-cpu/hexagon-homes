# Hexagon Homes

A responsive real-estate platform where people can browse, search and save properties, contact agents, and where agents manage their own listings with photo uploads. Built with **React + TypeScript (Vite)**, **Django REST Framework**, **PostgreSQL** and **JWT** authentication.

## Live links

| What | Link |
|---|---|
| Live website (frontend, Vercel) | https://hexagon-homes.vercel.app |
| Live API (backend, Render) | https://hexagon-homes.onrender.com/api/ |
| Interactive API documentation (Swagger) | https://hexagon-homes.onrender.com/api/docs/ |
| Source code | https://github.com/godwinhoods100-cpu/hexagon-homes |

> The backend runs on a free Render instance that sleeps when idle. The first request after a quiet period can take about 50 seconds; later requests are fast.

## Features

**Visitors and buyers**
- Browse properties with server-side keyword search, location, type, bedroom and maximum-price filters, sorting (newest, price) and pagination (12 per page)
- Property detail pages with an image gallery, key facts, amenities and the listing agent
- Register, log in, log out and stay signed in across refreshes (JWT with automatic refresh)
- Save and remove favourite properties, stored on the account and available on any device
- Contact the agent with a validated enquiry form (name, email, optional phone, message)

**Agents**
- Protected dashboard with real counts, listing management and an enquiries inbox
- Add and edit properties with up to 6 photos per upload (JPEG, PNG or WebP, 8 MB each) and image previews
- Draft or publish a listing, and delete listings

**Administrators**
- Can edit and delete any listing, and moderate data through the Django admin

**Quality**
- Responsive layout, loading, empty, error and retry states, form validation on every form
- Role-based authorization enforced by the API, not just the interface
- OpenAPI schema with interactive Swagger documentation
- Automated backend tests for authentication, permissions, filtering, favourites and uploads

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, React Router, Tailwind CSS, Vite, pnpm |
| Backend | Django 5.1, Django REST Framework, SimpleJWT, django-filter, drf-spectacular |
| Database | PostgreSQL (SQLite for zero-setup local development) |
| Image storage | Cloudinary in production, local `backend/media/` in development |
| Hosting | Vercel (frontend), Render (API and database) |

## Architecture

```text
Browser ── React SPA (Vercel)
              │  HTTPS / JSON + multipart, Bearer JWT
              ▼
        Django REST API (Render, gunicorn + WhiteNoise)
              │                         │
              ▼                         ▼
        PostgreSQL (Render)      Cloudinary (property photos)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data model, ER diagram and request flow.

## Project structure

```text
hexagon-homes/
├── src/                      React application
│   ├── components/           Layout, cards, search bar, UI primitives, route guard
│   ├── pages/                Home, Listings, PropertyDetails, Favourites, Dashboard, PropertyForm, auth
│   ├── hooks/                Data hooks (listings, enquiries) and favourites
│   ├── lib/                  API-to-UI mapper, constants, formatting, error helper
│   ├── context/AuthContext   Session handling
│   └── api.ts                API client: bearer auth, token refresh, multipart, error handling
├── backend/
│   ├── config/               Settings, URLs, Cloudinary storage
│   ├── accounts/             Custom user model, registration, JWT endpoints
│   └── properties/           Property, image, favourite and enquiry models and API
├── docs/                     Architecture, report, testing, demo script, ER diagram
└── vercel.json               Single-page-app routing for Vercel
```

## Run it locally

### Frontend

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .\.venv\Scripts\Activate.ps1      macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser     # superusers automatically get the admin role
python manage.py runserver           # http://localhost:8000
```

Optionally load sample agents and listings (development only):

```bash
python manage.py seed_demo --password "choose-a-password"
```

Log in with your **email** address, not the username.

### Environment variables

Create a `.env` file in the project root (it is gitignored). Minimum for local development:

```env
VITE_API_URL=http://localhost:8000/api
DJANGO_SECRET_KEY=replace-with-a-long-random-value
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the API, read by the frontend **at build time** |
| `DJANGO_SECRET_KEY` | Required when `DJANGO_DEBUG=false` |
| `DJANGO_DEBUG` | `true` locally, `false` in production |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hostnames (Render's own hostname is added automatically) |
| `CORS_ALLOWED_ORIGINS` | Frontend origins allowed to call the API (no trailing slash) |
| `CSRF_TRUSTED_ORIGINS` | HTTPS origins for the Django admin and secure requests |
| `DATABASE_URL` | PostgreSQL URL; leave unset to use SQLite |
| `DB_SSLMODE` | PostgreSQL SSL mode (`require` in production) |
| `CLOUDINARY_URL` | Turns on Cloudinary photo storage; leave unset locally |
| `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_PASSWORD` | Optional: create the first admin during deployment |

## API

Interactive documentation: `/api/docs/` · OpenAPI schema: `/api/schema/`

| Endpoint | Methods | Access |
|---|---|---|
| `/api/auth/register/` | POST | Public |
| `/api/auth/login/` | POST | Public |
| `/api/auth/refresh/` | POST | Public |
| `/api/auth/logout/` | POST | Authenticated |
| `/api/auth/profile/` | GET, PATCH | Authenticated |
| `/api/properties/` | GET | Public (published listings) |
| `/api/properties/` | POST | Agent or admin |
| `/api/properties/{id}/` | GET | Public (drafts visible to their owner) |
| `/api/properties/{id}/` | PATCH, DELETE | Owner or admin |
| `/api/favourites/` | GET, POST | Authenticated |
| `/api/favourites/{id}/` | DELETE | Owner |
| `/api/inquiries/` | POST | Public |
| `/api/inquiries/` | GET | Listing owner or admin |

Property list query parameters: `search`, `city`, `city__icontains`, `property_type`, `bedrooms__gte`, `price__gte`, `price__lte`, `owner`, `ordering` (`price`, `created_at`, `bedrooms`, each also with a leading `-` for descending) and `page`.

### Roles

| Capability | Visitor | Buyer (`user`) | Agent | Admin |
|---|---|---|---|---|
| Browse and search | ✓ | ✓ | ✓ | ✓ |
| Send an enquiry | ✓ | ✓ | ✓ | ✓ |
| Save favourites | | ✓ | ✓ | ✓ |
| Create listings | | | ✓ | ✓ |
| Edit or delete listings | | | own | all |
| Read enquiries | | | own listings | all |

## Security

- Passwords use Django's salted hashing and validators.
- Access tokens expire after 15 minutes; refresh tokens last 7 days, rotate and are blacklisted at logout.
- Every write is authorized on the server; agents cannot change another agent's listing.
- Administrator accounts cannot be self-registered.
- Image type and an 8 MB size limit are enforced on the server.
- Production enables HTTPS redirect, secure cookies, HSTS, MIME-sniffing protection and clickjacking protection; secrets and origins come from environment variables.

## Verification

```bash
pnpm build
cd backend
python manage.py check
python manage.py test
python manage.py spectacular --validate --file schema.yml
```

## Deployment

**Database.** Create a PostgreSQL database on Render and copy its internal URL.

**Backend (Render web service).**

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput && (python manage.py createsuperuser --noinput \|\| true)` |
| Start command | `gunicorn config.wsgi:application` |
| Environment | `PYTHON_VERSION`, `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `DATABASE_URL`, `CLOUDINARY_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `DJANGO_SUPERUSER_*` |

**Photos.** Render's disk is wiped on every restart, so production uploads are stored on Cloudinary (`backend/config/storage.py`), enabled by setting `CLOUDINARY_URL`.

**Frontend (Vercel).** Import the repository, keep the Vite defaults and set `VITE_API_URL=https://<your-api>.onrender.com/api`. Vite reads this at build time, so redeploy after changing it. Then add the Vercel address to `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` on Render.

## Known limitations

- Photos can be added to a listing but not yet removed or reordered individually.
- Enquiries can be read in the dashboard but cannot be marked as read.
- The free hosting tier sleeps when idle, and the free Render database expires after about 30 days.
- Prices are shown in pounds sterling.

## Documentation

- [System design and ER diagram](docs/ARCHITECTURE.md)
- [Project report](docs/PROJECT_REPORT.md)
- [Testing summary](docs/TESTING.md)
- [Demonstration script](docs/DEMO_SCRIPT.md)

## Credits

Demo listing imagery is illustrative artwork used for demonstration only. The forest scene is by Kiddo. Interface icons are from [Lucide](https://lucide.dev).
