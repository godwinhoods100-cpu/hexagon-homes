# Hexagon Homes

A responsive real-estate management platform built with React, TypeScript, Vite, Django REST Framework, PostgreSQL and JWT authentication.

## Features

- Curated property discovery with keyword, location, type, bedroom and price filters
- Dynamic property pages, image galleries, amenity details and agent inquiries
- Registration, JWT login/refresh/logout, profile management and role-aware navigation
- Buyer favourites with database-level duplicate protection
- Agent listing CRUD, multiple validated image uploads and inquiry management
- Administrator moderation through the Django admin and API permissions
- Responsive, accessible interface with loading, empty, success and error states
- OpenAPI schema and interactive Swagger API documentation
- Automated authentication, permissions, CRUD, filtering, favourite and upload tests

## Architecture

```text
React SPA ── HTTPS/JSON + JWT ── Django REST API ── PostgreSQL
                                      │
                                      └── media storage (local in development)
```

The UI currently ships with a built-in sample dataset. `src/api.ts` provides the production integration boundary, including bearer authentication, single token-refresh retry, multipart support and normalized errors. Configure `VITE_API_URL` when connecting the deployed UI workflows to Django.

## Local setup

### Frontend

```bash
pnpm install
cp .env.example .env
pnpm dev
```

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp .env.example .env
python backend/manage.py migrate
python backend/manage.py createsuperuser
python backend/manage.py runserver
```

Django reads the root `.env` file. Keep `DJANGO_DEBUG=true` for local work, and leave `DATABASE_URL` commented out to use SQLite. Superusers created with `createsuperuser` automatically get the `admin` role. Log in with your **email** (not the username).

For a zero-configuration local check, omit `DATABASE_URL` and Django uses SQLite. Set `DATABASE_URL` to a PostgreSQL URL for normal development and production.

## Verification

```bash
pnpm build
python backend/manage.py check
python backend/manage.py makemigrations --check
python backend/manage.py test
python backend/manage.py spectacular --validate --file schema.yml
```

## API

Interactive documentation is available at `/api/docs/`; the OpenAPI document is at `/api/schema/`.

| Endpoint | Methods | Access |
|---|---|---|
| `/api/auth/register/` | POST | Public |
| `/api/auth/login/` | POST | Public |
| `/api/auth/refresh/` | POST | Public |
| `/api/auth/logout/` | POST | Authenticated |
| `/api/auth/profile/` | GET, PATCH | Authenticated |
| `/api/properties/` | GET | Public |
| `/api/properties/` | POST | Agent/Admin |
| `/api/properties/{id}/` | GET | Public |
| `/api/properties/{id}/` | PATCH, DELETE | Owner/Admin |
| `/api/favourites/` | GET, POST | Authenticated |
| `/api/favourites/{id}/` | DELETE | Owner |
| `/api/inquiries/` | POST | Public |
| `/api/inquiries/` | GET | Listing owner/Admin |

Property query parameters include `search`, `city`, `city__icontains`, `property_type`, `bedrooms__gte`, `price__gte`, `price__lte`, `ordering` and `page`.

## Security

- Passwords use Django's salted adaptive hashing and validators.
- Access tokens expire after 15 minutes; refresh tokens rotate and are blacklisted at logout.
- Every write operation is authorized server-side; agents cannot edit another agent's listings.
- Admin roles cannot be self-registered.
- Upload formats and an 8 MB size cap are enforced server-side.
- Production settings enable HTTPS redirect, secure cookies, HSTS, MIME sniffing protection and frame denial.
- Secrets, origins and hostnames are environment-based.

## Deployment

1. Create a hosted PostgreSQL database and persistent media/object storage.
2. Deploy `backend/` to a Python host with `gunicorn config.wsgi`, then run migrations.
3. Set `DJANGO_SECRET_KEY`, `DATABASE_URL`, `DJANGO_DEBUG=false`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.
4. Deploy the repository root to Vercel or Netlify with build command `pnpm build` and output `dist`.
5. Set `VITE_API_URL=https://your-api-host/api` and redeploy the frontend.

Local media is not suitable for ephemeral production filesystems. Configure S3-compatible persistent storage before accepting production uploads.

## Documentation

- [System design and ER diagram](docs/ARCHITECTURE.md)
- [Testing summary](docs/TESTING.md)
- [Academic project report](docs/PROJECT_REPORT.md)
- [Demonstration script](docs/DEMO_SCRIPT.md)
