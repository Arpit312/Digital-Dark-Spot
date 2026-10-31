# DarkSpot Atlas Web (Frontend)

- **Local Dev**: `npm run dev` -> `http://localhost:3000`
- **Routes**: `/` `/analyze` `/report/[id]` `/reports` `/profile` `/support` `/watchtower` `/accuracy` `/how-it-works` `/campus` `/login` `/signup` `/settings` `/officer` `/admin` `/docs` `/privacy` `/terms`
- **Navigation System**: N1 Top Bar with underline indicator & circular avatar, N3 Left Drawer Rail triggered via Logo click, S1 Command Palette (Ctrl+K).
- **Backend API**: Configured in `.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:8000`).
- **Real Data**: The report page uses `getAnalysis(id)` to load live multi-agent audit data and quote-verified evidence directly from the backend.
- **Authentication**: Connected to Supabase Auth via backend `/auth/signup` and `/auth/login` with JWT verification.
- **Logo Mark**: L3 Missing Line icon with text rows and central dark spot gap.
