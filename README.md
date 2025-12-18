# Ahmed Mostafa — Portfolio Website

Modern, responsive developer portfolio built with **React 19 + Vite** and a small **Express** backend for the contact form (`POST /api/contact`).

## Tech Stack

- **Frontend:** React 19 (JavaScript/JSX), Vite
- **Styling:** TailwindCSS + CSS variables
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend:** Express + Nodemailer (SMTP)
- **Runtime:** Node.js 18+ (ESM project)

## Features

- **Dark/Light mode** with persistence (localStorage) + smooth transitions
- **Responsive layout** optimized for mobile → desktop
- **SEO-friendly** structure/meta tags
- **Contact form** with validation, honeypot, and basic rate-limiting
- **Media support** with optional Cloudflare R2 public base URL
- **PDFs served inline** (both dev + production)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm if you prefer)

### Install

```bash
npm install
```

### Run locally (recommended)

This starts **both**:
- Vite dev server (frontend)
- Express server on `http://localhost:3000` (API)

```bash
npm run dev
```

The frontend calls `/api/contact`, which is proxied in dev to the Express server.

### Environment Variables

Create a `.env` file in the project root (don’t commit it).

```bash
# Backend (Express / Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_TO_EMAIL=your_email@gmail.com
# Optional:
CONTACT_FROM_EMAIL=your_email@gmail.com
SITE_URL=https://your-domain.com
BRAND_NAME=Ahmed Mostafa
BRAND_LOGO_URL=https://your-domain.com/logo.png

# Frontend (Vite)
# If set, images/PDFs can be built/loaded from an R2 public base URL
VITE_R2_PUBLIC_URL=https://your-public-bucket-domain
```

## Production

### Build

```bash
npm run build
```

### Run (serves `dist/` + `/api`)

In production, the Express server serves the built frontend from `dist/` and handles `/api/contact`.

```bash
npm run start
```

### Note about `npm run preview`

`npm run preview` runs Vite’s preview server (frontend only). For a full production-like run (frontend + API), use `npm run build` then `npm run start`.

## Project Structure

```
src/
├── components/               # UI sections and shared components (.jsx/.css)
├── context/                  # Theme provider
├── utils/                    # Helpers (animations, asset URL helpers, ...)
├── App.jsx                   # App composition
├── main.jsx                  # Entry point
└── index.css                 # Global styles + theme variables

server/
├── mailApi.js                # POST /api/contact
├── emailConfig.js            # SMTP + brand/contact config from env
└── contactEmailTemplate.js   # Styled HTML + text email body

server.js                     # Express app (API + serving dist/)
```

## Customization

- **Sections/content:** update components in `src/components/` (e.g. `Hero.jsx`, `Projects.jsx`, `Experience.jsx`, `Contact.jsx`)
- **Social links:** typically in `Hero.jsx`, `Contact.jsx`, and `Footer.jsx`
- **Theme/styling:** `src/index.css` + Tailwind classes (see `tailwind.config.js`)
- **Profile image/static assets:** place files in `public/` and reference them via `/your-file.png`

## Troubleshooting

- **`server_not_configured`**
  - Ensure the required env vars exist: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL`.
- **`smtp_tls_failed` / “self-signed certificate in certificate chain”**
  - Usually caused by VPN/corporate proxy/antivirus SSL inspection. Try a different network or disable SSL inspection.
- **`smtp_auth_failed`**
  - For Gmail, use an **App Password** (not your normal password).
- **`rate_limited`**
  - The backend applies a small per-IP limit to reduce spam.

## Notes

- Performance docs: `PERFORMANCE_ANALYSIS.md`, `HEAVIEST_COMPONENTS.md`
- Deployment entrypoint: `server.js` (see `Procfile`)

## License

MIT — see `LICENSE`.

## Author

**Ahmed Mostafa**
- Email: ahmedmostafa.swe1@gmail.com
- GitHub: [@ahmedmo-27](https://github.com/ahmedmo-27)
- LinkedIn: [Ahmed Mostafa](https://linkedin.com/in/ahmedmostafa-swe)
