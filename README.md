# GGCC Sahiwal — prospectus site

```
ggccswl/
├── public/                 # Static site (served at / by the Node server)
│   ├── index.html          # Home and other pages (*.html)
│   ├── assets/             # theme.css, animate.js, images/
│   └── admin/              # Staff admin UI → http://localhost:3000/admin/
├── server/                 # Express API, sessions, uploads handling
│   ├── index.js
│   ├── data/app.json       # JSON “database” (lessons, programs, gallery refs, …)
│   ├── .env                # ADMIN_PASSWORD, SESSION_SECRET (not committed)
│   └── package.json
├── uploads/                # User-uploaded files (lessons, lists, gallery, prospectus)
└── README.md               # This file
```

### Run the full site (recommended)

From `server/`: `npm install` → `npm start` → open **http://localhost:3000**.

### Static preview only (no API)

From `public/`: `python3 -m http.server 8080` — pages load, but `/api/...` features will not work until you use the Node server.
