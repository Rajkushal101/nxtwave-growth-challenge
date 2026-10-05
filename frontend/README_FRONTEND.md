# NxtWave AI Project Matcher — Frontend Only

This package contains **only the React/Vite frontend**. It does not include or modify your FastAPI backend.

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

Your backend should run on:

```text
http://127.0.0.1:8002
```

The included `vite.config.js` proxies `/api/*` to port 8002, so you do not need to hardcode localhost inside the React app.

## Production API URL

Set:

```text
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Main backend endpoints expected

Required core endpoints:

- `GET /api/health`
- `POST /api/recommend`
- `POST /api/recommend/switch`
- `POST /api/register`

Referral / analytics screens also attempt the Phase 3/4 endpoint shapes described in the project architecture. The API client includes small compatibility fallbacks for common naming differences.

## Important profile-state fix

The quiz uses **one single React profile object** and submits the exact final object directly to `/api/recommend`. It intentionally does not merge demo defaults or cached profile values. This avoids the stale CSE/Cybersecurity profile bug found during manual referral testing.

## Replace an existing frontend

Back up your current `frontend/` first. Then replace its files with this package, install dependencies and run `npm run dev`.

## Motion / animated graphics layer
This version adds a production-safe animated UI layer without touching backend logic:
- interactive AI Project Match core in the landing hero
- orbiting profile signals + flowing SVG data paths
- progressive hero reveal
- animated score bars and dashboard bars
- referral-card sheen + QR pulse
- reward unlock motion
- hover/micro-interactions
- `prefers-reduced-motion` fallback for accessibility

The motion is implemented with React + CSS/SVG only, so there are no video CDN dependencies and no extra API keys/secrets.
