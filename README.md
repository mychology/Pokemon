# React + Vite + Tailwind CSS

This is the repository of the Pokédex App using the Pokémon public API (https://pokeapi.co/) from the public API repository (https://github.com/public-apis/public-apis).

Developed as a Learning Evidence project under the subject ICE 415: Professional Elective 5 (BSIT-BTM 4B) by:

- Bless Mycho Jamil
- Rose Ann Lanticse
- Jherick Lloyde Ito

## Current Features

- Realistic Pokédex-inspired layout and controls
- Complete roster of all Pokémon species (Gen 1–9, 1025 entries)
- Official artwork plus animated game sprites (normal and shiny)
- Cry button per species with oscillator fallback
- Editable display name that doubles as a search bar
- Accurate typing chips plus Mega Evolution and Other Forms cycling
- Support for Dynamax, Gigantamax, seasonal, and regional forms via the D-pad
- Cached type filter button for fast browsing
- Lore/flavor text panel, ability info, and stats meter
- Moveset pager, held-item display, and size comparison cards
- Evolution panel that respects override artwork
- Clear entry button to reset hook state
- Admin-only override console for custom names, descriptions, art, sprites, and held items

## Local Development

1. **Install dependencies**
   ```powershell
   cd poke-app
   npm install           # frontend
   cd server
   npm install           # backend
   ```
2. **Environment variables**
   - `poke-app/.env`
     ```
     VITE_OVERRIDE_API_URL="http://localhost:4000"
     ```
   - `poke-app/server/.env`
     ```
     DATABASE_URL="file:./dev.db"
     ADMIN_TOKEN=bruh-moment
     ```
3. **Run both processes**
   ```powershell
   # terminal 1
   cd poke-app/server
   npm run dev

   # terminal 2
   cd poke-app
   npm run dev
   ```
4. Optional DB viewer: `cd poke-app/server && npx prisma studio`

## Deployment Plan (Free Tiers)

The project is already full-stack (React frontend + Express/Prisma backend). To host it for free:

### 1. Managed Postgres (Supabase free tier)
1. Create a Supabase project (free plan: 500 MB Postgres + 1 GB storage).
2. Copy the **Connection string** (Project Settings → Database → Connection pooling (pgBouncer) → `connection string`).
3. Configure backend environment variables (Render dashboard or CI secrets):
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/postgres?pgbouncer=true&connection_limit=1"
   ADMIN_TOKEN=<choose-a-strong-token>
   ```
4. Deploy schema:
   ```powershell
   cd poke-app/server
   npx prisma migrate deploy
   npm run prisma:generate
   ```

### 2. Backend on Render (free web service)
1. Push this repo to GitHub.
2. On https://render.com create a new **Web Service** pointed at the `poke-app/server` subdirectory.
   - Build: `npm install && npx prisma migrate deploy && npm run prisma:generate`
   - Start: `npm run start`
   - Environment vars: same as `server/.env` (plus `PORT=4000` if you want to fix the port).
3. **Uploads:** The backend currently writes to `server/uploads`. Render’s free disk is ephemeral, so either attach a paid persistent disk or point uploads to external storage (Supabase Storage, Cloudinary, etc.) before production usage.
4. After deploy, note the public URL (e.g., `https://pokedex-overrides.onrender.com`) and use it for `VITE_OVERRIDE_API_URL`.

### 3. Frontend on Netlify or Vercel
1. Verify locally: `cd poke-app && npm run build`.
2. Netlify steps (similar on Vercel):
   - New site from Git → root `poke-app`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Env vars: `VITE_OVERRIDE_API_URL=https://pokedex-overrides.onrender.com`
3. Deploy, open the override console, set the admin token, and confirm edits persist.

### 4. Smoke-Test Checklist
1. Frontend loads with no console errors.
2. Backend `/api/health` returns `{ ok: true }`.
3. Overrides persist:
   - Rename a Pokémon, refresh → new name remains.
   - Click **Reset Text** → name/description revert to PokéAPI defaults.
   - Upload sprite/art and verify orb, art window, and evolution boxes update.
4. Inspect the hosted DB via Prisma Studio (tunnel through Supabase connection if needed).
5. Optionally add an uptime monitor to keep the free Render instance awake.

Following these steps keeps everything within generous free tiers (Supabase, Render, Netlify). For higher traffic, upgrade the database or move uploads to a dedicated object store/CDN—no code changes required.
