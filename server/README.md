# GGCC website server (API + uploads + admin)

The public HTML pages need this server for:

- **Lessons** (videos, YouTube, PDFs, links)
- **Admission / result PDF lists**
- **Gallery** images (shown on Media Gallery)
- **Prospectus** download (always returns a PDF — official file after admin upload, or a short placeholder)
- **Program offerings** (cards on the public Academics / Programs page — editable in Admin → Programs)

Students use the normal site (read-only). Staff use **`/admin/`** with the password from `.env`.

## Setup

```bash
cd server
cp .env.example .env
# Edit .env — set ADMIN_PASSWORD and SESSION_SECRET
npm install
npm start
```

Open **http://localhost:3000** (or your `PORT`). Admin: **http://localhost:3000/admin/**

## Production notes

- Set `NODE_ENV=production` and `secure: true` cookies (already tied to `NODE_ENV` in code) behind HTTPS.
- Put a reverse proxy (nginx, Caddy) in front if exposing to the internet.
- Change `ADMIN_PASSWORD` to a long random value; consider adding more admins or OAuth later.

## Data

- `data/app.json` — lessons, lists, gallery metadata (back this up).
- `../uploads/` — binary files (videos, PDFs, images).

## Layout

Static pages and admin UI live in **`../public/`** (HTML, `assets/`, `admin/`). Express serves that folder at the site root; the API and uploads stay separate.
