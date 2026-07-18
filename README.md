# EcoTrack Client

## Setup
```bash
npm install
npm run dev
```
Runs on http://localhost:3000 — make sure the backend (ecotrack-server) is running on http://localhost:5000 first.

## Before first use
1. Start the backend and run its seed script once to populate sample challenges:
   ```bash
   cd ../ecotrack-server
   npm run seed
   ```
2. Create the demo login account by registering once at http://localhost:3000/register with:
   - Email: demo@ecotrack.app
   - Password: demo1234
   (After that, the "Use demo credentials" button on the login page will work.)

## Pages
- `/` — Landing page
- `/challenges` — Explore (search, filter, sort, pagination)
- `/challenges/[id]` — Details (public)
- `/challenges/add` — Add Challenge (protected, AI content generator)
- `/challenges/manage` — Manage your challenges (protected)
- `/dashboard` — Log activities, view footprint trend, AI analyzer + recommendations (protected)
- `/login`, `/register` — Auth
- `/about`, `/contact` — Additional pages
