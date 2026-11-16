# Demonstration script (about 9 minutes)

Record in one take at 1080p. Speak to the points in *italics*; the numbers are target times.

## Before recording (5 minutes)

1. Two minutes before, open https://hexagon-homes.onrender.com/api/docs/ so the free backend is awake.
2. Make three accounts at https://hexagon-homes.vercel.app: an **admin** (the superuser created on Render), an **agent** and a **buyer**. Note the emails; keep passwords out of the video.
3. As the admin or agent, make sure there are 4 or more listings with photos, in at least two cities and different prices.
4. Log everyone out, zoom the browser to about 110%, close extra tabs and notifications.
5. Keep open in other tabs: the Swagger page, the Django admin, the GitHub repository and `docs/er-diagram.png`.

## Script

**0:00 – 0:45 Introduction**
Show the Home page. *"Hexagon Homes is a real-estate platform where buyers browse and save homes and contact agents, and agents manage their own listings. React and TypeScript front end on Vercel, Django REST Framework API on Render with PostgreSQL, Cloudinary for photos, JWT authentication."*

**0:45 – 2:00 Search and filters**
Scroll the featured homes, open **Properties**. Search a keyword, then use the city box, type, bedrooms and maximum price. Change the sort order. Show a search that returns nothing and clear it. *"Filtering, sorting and pagination all run on the server, 12 homes per page."*

**2:00 – 3:00 Property details**
Open a listing. Point out the gallery, key facts, amenities and agent. Click the heart while logged out and show the redirect to login. *"Saving needs an account."*

**3:00 – 4:30 Buyer account**
Register as the buyer: first submit a weak password to show validation, then a valid one. Show you are back on the property. Save two homes, open **Favourites**, refresh the page. *"Favourites are stored on the account, protected by a unique database constraint."*

**4:30 – 5:15 Contact agent**
On a property, send the form with an empty name to show validation, then send a real message. Show the thank-you message.

**5:15 – 7:15 Agent workflow**
Log out, log in as the agent. Show the dashboard counts. Click **Add property**, try submitting without a photo, then add two photos (show the previews), fill the fields and publish. Open the new listing. Click **Edit**, change the price and save. Back on the dashboard, show **Recent enquiries** with the buyer's message. *"Only the owner or an admin can change a listing; the API enforces it."* Delete the test listing and confirm.

**7:15 – 8:00 API and security**
Switch to Swagger. Show the list of endpoints and run `GET /api/properties/`. *"JWT access tokens last 15 minutes, refresh tokens rotate and are blacklisted at logout. Roles are visitor, buyer, agent and admin."* Optionally show a 403 when a buyer token calls `POST /api/properties/`.

**8:00 – 8:45 Architecture and quality**
Show `docs/er-diagram.png`: five related tables, foreign keys and the unique favourites constraint. Mention the automated tests, the `pnpm build`, and that photos live on Cloudinary because the free host wipes its disk.

**8:45 – 9:15 Close**
Show the GitHub repository and README. *"Every minimum feature and technical requirement is delivered and deployed, plus pagination as a bonus. Next steps would be removing photos, marking enquiries read, email verification and password reset. Thank you."*

## Tips

- If a page is slow right after a quiet period, that is the free server waking up. Cut it in editing or wait.
- Do not show passwords or the Render and Cloudinary dashboards.
- Keep to the time: 5 to 10 minutes is required.
