# React + Vite + Tailwind CSS

This is the repository of the Pokédex App using the Pokémon public api [https://pokeapi.co/] from the public API repository [https://github.com/public-apis/public-apis.git].

Developed as a Learning Evidence project under the subject ICE 415: Professional Elective 5 (BSIT-BTM 4B) by the following members:

- Bless Mycho Jamil
- Rose Ann Lanticse
- Jherick Lloyde Ito

## Local development

1. **Install deps**
   ```powershell
   cd poke-app
   npm install           # frontend
   cd server
   npm install           # backend
   ```
2. **Environment variables**
   - `poke-app/.env`: `VITE_OVERRIDE_API_URL="http://localhost:4000"`
   - `poke-app/server/.env`:
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
4. Prisma Studio (optional DB viewer): `cd poke-app/server && npx prisma studio`

## Deployment plan (free tiers)

The project is already full-stack (React frontend + Express/Prisma backend). To host it for free:

### 1. Provision a managed Postgres database (Supabase free tier)
1. Create a Supabase project (free plan: 500 MB Postgres + 1 GB storage).
2. Copy the **Connection string** (Project Settings → Database → Connection pooling (pgBouncer) → `connection string`).
3. Set backend environment variables (Render dashboard or `.env` for CI):
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/postgres?pgbouncer=true&connection_limit=1"
   ADMIN_TOKEN=<choose-a-strong-token>
   ```
4. Run migrations against the remote DB:
   ```powershell
   cd poke-app/server
   npx prisma migrate deploy
   npm run prisma:generate
   ```

### 2. Deploy backend to Render (free web service)
1. Push this repo to GitHub.
2. On [render.com](https://render.com):
   - Create a new **Web Service**, link the `server` directory (Render lets you override root via “Monorepo” option, set root = `poke-app/server`).
   - Build command: `npm install && npx prisma migrate deploy && npm run prisma:generate`
   - Start command: `npm run start`
   - Environment variables: paste the same values as in `server/.env` (Render → Environment → Bulk Edit). Include `PORT=4000` if you want a fixed port.
3. **Uploads**: The current backend stores files under `server/uploads`. Render’s free file system is ephemeral, so you either need to (a) add a paid persistent disk, or (b) point the upload handler to an external object store such as Supabase Storage/Cloudinary. Until you wire that up, expect uploads to vanish whenever the service redeploys.
4. Once deployed, note the public URL (e.g., `https://pokedex-overrides.onrender.com`). This becomes the value of `VITE_OVERRIDE_API_URL` for production.

### 3. Deploy frontend to Netlify (free tier) or Vercel
1. Build locally to ensure success: `cd poke-app && npm run build`.
2. Netlify steps (similar for Vercel):
   - Create new site from Git → select repo root (`poke-app`).
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables:
     - `VITE_OVERRIDE_API_URL=https://pokedex-overrides.onrender.com`
   - (Optional) add `VITE_POKEAPI_BASE` if you ever mirror the public API.
3. After deploy, visit the site. Open the override console, set the admin token, and confirm you can edit/save.

### 4. Smoke-test checklist
1. Frontend loads from Netlify/Vercel (no console errors).
2. Backend `/api/health` returns `{ ok: true }` from Render.
3. Override edits persist:
   - Change a Pokémon name, refresh page → new name is visible.
   - Click **Reset Text** → name/description revert to PokéAPI defaults (and the slug resets, so search works again).
   - Upload sprite/art and verify the orb, main art, and evolution boxes use the override.
4. Prisma Studio against Supabase to inspect data (SSH tunnel recommended).
5. Optionally configure a cron/uptime monitor (e.g., BetterStack free) to keep Render free instance warm.

Following these steps keeps everything within the generous free tiers (Supabase, Render, Netlify) while giving you a production-ready full-stack deployment. For higher traffic, upgrade the database or move uploads to a dedicated CDN, but no code changes are required. 
