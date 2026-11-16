# Testing summary

## 1. Automated backend tests

Run from the `backend/` folder:

```bash
python manage.py test
```

| Test | What it proves |
|---|---|
| `test_register_login_profile_and_logout` | Registration, JWT login, authenticated profile access and token blacklisting at logout |
| `test_register_without_username_and_case_insensitive_email` | A username is generated from the email, and duplicate emails are rejected whatever their capitalisation |
| `test_superuser_gets_admin_role` | Superusers automatically receive the admin role |
| `test_public_can_list_and_filter` | Visitors can list and filter published properties |
| `test_only_agent_can_create` | Buyers cannot create listings; agents can |
| `test_owner_permission_blocks_update_and_delete` | An agent cannot change or delete another agent's listing |
| `test_duplicate_favourite_is_prevented` | The same home cannot be saved twice |
| `test_image_upload` | A real in-memory JPEG is accepted and stored against a property |

Other checks:

```bash
python manage.py check
python manage.py makemigrations --check
python manage.py spectacular --validate --file schema.yml
pnpm build
```

### Results of the final run

Paste the real output here before submitting.

| Command | Date | Result |
|---|---|---|
| `python manage.py test` | | |
| `python manage.py check` | | |
| `pnpm build` | | |

## 2. Manual acceptance checklist (live site)

Tick each item after trying it on https://hexagon-homes.vercel.app.

**Discovery**
- [ ] Home shows the newest listings; "View all properties" opens the listings page
- [ ] Keyword search returns matching homes
- [ ] City, type, bedroom and maximum-price filters work alone and together; Clear resets them
- [ ] Sorting by newest, price low to high and price high to low changes the order
- [ ] A search with no matches shows the empty state with a clear-filters button
- [ ] With more than 12 homes, Previous and Next move between pages
- [ ] An unknown property address (for example `/property/9999`) shows the not-found page

**Property page**
- [ ] Gallery, key facts, amenities and the agent name are correct
- [ ] Clicking the heart while logged out sends you to the login page and returns you afterwards
- [ ] The enquiry form rejects an empty name, an invalid email and a message under 10 characters
- [ ] A valid enquiry shows the thank-you message

**Accounts**
- [ ] Registration rejects a weak password and a duplicate email
- [ ] Login with a wrong password shows an error; the correct password signs in
- [ ] Refreshing the page keeps you signed in; Log out ends the session
- [ ] Dashboard and Favourites redirect to login when signed out

**Buyer**
- [ ] Saved homes appear on the Favourites page and are still there after a refresh and after logging out and back in
- [ ] Removing a saved home updates the heart immediately

**Agent**
- [ ] A buyer cannot open `/property/new` (redirected)
- [ ] Dashboard shows the correct listing and enquiry counts
- [ ] Add property: missing photo is rejected; a non-image or oversized file is rejected; a valid listing with photos is created and opens
- [ ] Edit: changing the price saves; adding a photo appends it; unticking Publish hides the home from visitors
- [ ] The enquiry from the buyer appears under Recent enquiries
- [ ] Delete asks for confirmation and removes the listing
- [ ] Photos are still there after the API has restarted (confirms cloud storage)

**Admin**
- [ ] Admin sees Edit property on every listing and can edit any one
- [ ] Django admin at `/admin/` lists users, properties, favourites and enquiries

**Resilience**
- [ ] With the API unreachable, pages show a clear error with a Try again button

**Responsive and accessibility**
- [ ] Layout works at about 375 px, 768 px and 1440 px widths; mobile menu opens and closes
- [ ] Forms have labels, keyboard focus is visible and images have alternate text

## 3. API checks in Swagger

At `/api/docs/`, with a buyer token: `POST /api/properties/` returns 403. With an agent token: editing another agent's property returns 403 or 404. `POST /api/favourites/` twice with the same property does not create two rows.
