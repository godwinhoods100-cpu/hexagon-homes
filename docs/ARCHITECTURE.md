# Architecture and database design

## Components

- **React SPA:** navigation, discovery, details, account and agent workflows.
- **API client:** JSON/multipart requests, bearer headers, token refresh and normalized failures.
- **Django REST API:** serializers provide validation; viewsets expose REST resources; permissions enforce roles and ownership.
- **PostgreSQL:** authoritative relational data store. SQLite is only the local zero-configuration fallback.
- **Media:** filesystem in development; persistent S3-compatible storage is required in production.

## ER diagram

```mermaid
erDiagram
  USER ||--o{ PROPERTY : owns
  USER ||--o{ FAVOURITE : saves
  USER ||--o{ INQUIRY : sends
  PROPERTY ||--o{ PROPERTY_IMAGE : has
  PROPERTY ||--o{ FAVOURITE : receives
  PROPERTY ||--o{ INQUIRY : receives

  USER {
    bigint id PK
    string email UK
    string password_hash
    enum role
    string phone
  }
  PROPERTY {
    bigint id PK
    bigint owner_id FK
    string title
    decimal price
    string city
    enum property_type
    int bedrooms
    int bathrooms
    int area_sqft
    json amenities
  }
  PROPERTY_IMAGE {
    bigint id PK
    bigint property_id FK
    string image
    boolean is_primary
  }
  FAVOURITE {
    bigint id PK
    bigint user_id FK
    bigint property_id FK
  }
  INQUIRY {
    bigint id PK
    bigint property_id FK
    bigint sender_id FK
    string email
    text message
  }
```

`Favourite(user_id, property_id)` has a unique database constraint. Property discovery uses an index over city, property type and price. Foreign-key deletion behaviour is explicit: owned listings and their dependent media/favourites are deleted with an owner/property, while inquiry senders become null to retain an agent's business record.
