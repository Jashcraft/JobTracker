# JobTracker

A small full-stack app for tracking job applications — built to replace a spreadsheet I was
using during an active job search, and to have something real and deployed to point to in
interviews.

**Live app:** _add Render URL here once deployed_

## Why

I was tracking company, posting link, status, and follow-up dates in a spreadsheet. It worked,
but I wanted something I could check from anywhere, that nudges me when an application's been
sitting too long without a follow-up, and that doubles as a demo of shipping a real full-stack
app end to end — not just a tutorial clone.

## Features

- Add, edit, and delete job applications (company, title, posting link, contact email, status,
  dates, cover letter status, notes)
- Status pipeline: Not Started → Materials Prepped → Applied → Interview → Offer / Rejected /
  Withdrawn, with color-coded badges
- Filter by status, sort by company/status/date applied
- Follow-up flag: applications sitting in "Applied" for 14+ days get flagged automatically

## Stack

- **Frontend:** React (Vite), Tailwind
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Deployment:** Render

## Running it locally

```bash
git clone git@github.com:Jashcraft/JobTracker.git
cd JobTracker
```

Add `server/.env` (from `server/.env.example`, with your own `MONGO_URI`) and `client/.env`
(from `client/.env.example`) first, then:

```bash
npm run install:all   # installs server/ and client/ deps
npm run dev           # runs both dev servers together
```

Or run them separately:

**Server:**
```bash
cd server
npm install
npm start
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## Roadmap

- Stats dashboard (response rate, applications per week)
- CSV import/export
- Deploy to Render
