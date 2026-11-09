# Testing summary

## Automated coverage

Backend tests cover registration, JWT login, authenticated profile access, logout blacklisting, public listing/filtering, agent-only creation, cross-owner update/delete denial, duplicate favourite prevention and a real in-memory JPEG upload.

## Manual acceptance checklist

- Test navigation and cards at 375 px, 768 px and 1440 px widths.
- Search by title/location; combine location, type, bedroom and maximum-price filters; clear filters.
- Open each property route and an unknown ID.
- Submit invalid and valid authentication forms.
- Confirm dashboard and favourites redirect while signed out.
- Sign up as buyer and agent; confirm agent-only listing controls.
- Preview an accepted image and reject unsupported/oversized images at the API.
- Submit an inquiry and verify it appears only for the listing owner.
- Verify keyboard focus, labels, contrast, alternate text and the mobile menu.

Actual command results are recorded in the completion report rather than fabricated here.
