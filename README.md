# GPOC EVD Travel Screening

Ebola Virus Disease (EVD) travel screening for GPOC staff. A staff member
fills in the screening form before travelling abroad, gets a QR-coded
travel pass to show at the clinic or a checkpoint, and can see the history
of everything they've submitted.

**Stack:** Next.js 16 (App Router, TypeScript strict), Prisma 7 + PostgreSQL,
Tailwind CSS v4, Zod, React Hook Form, Server Actions, `qrcode` + `sharp`
for the QR pass image, `pdf-lib` for the downloadable PDF, database-backed
sessions (no hosted auth service).

## 1. Running locally

1. **Start Postgres** (Docker):

   ```bash
   docker compose up -d
   ```

   This runs Postgres 16 on **host port 5434** (not the default 5432, to
   avoid clashing with any other local Postgres you might have running).

2. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

   The `--legacy-peer-deps` flag is needed because `@hookform/resolvers@6`
   lists some optional peers (`effect`, `@typeschema/*`) that npm's default
   resolver gets overly strict about — they're not actually used by the
   Zod integration this project uses.

3. **Copy the env file** and adjust anything you need to (see [section 2](#2-environment-variables)):

   ```bash
   cp .env.example .env
   ```

4. **Run migrations:**

   ```bash
   npm run db:migrate
   ```

   (This runs `prisma migrate deploy`, which applies the migrations already
   committed under `prisma/migrations/`. Use `npx prisma migrate dev` only
   if you're changing `prisma/schema.prisma` yourself and want a new
   migration generated.)

5. **Seed demo data (optional but recommended):**

   ```bash
   npm run db:seed
   ```

   Creates `demo@gpoc.test` / `Demo1234` with 3 example screenings, one of
   them flagged as needing review.

6. **Start the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

7. **Everything else:**

   ```bash
   npm run typecheck   # tsc --noEmit
   npm run lint         # eslint
   npm run test         # vitest run
   npm run build        # production build
   ```

### Testing password reset without SMTP

Leave `SMTP_HOST` (and the other `SMTP_*` vars) blank in `.env`. Requesting
a password reset will print the reset link straight to your `npm run dev`
terminal instead of sending an email — open that link in your browser.

## 2. Environment variables

All of these live in `.env` (copy from `.env.example`):

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Postgres connection string. The docker-compose setup here uses `postgresql://gpoc:gpoc_dev_password@localhost:5434/gpoc_evd`. |
| `APP_URL` | The app's public base URL — used to build the password-reset link sent by email. Set this to your real domain in production. |
| `SESSION_SECRET` | Not used to sign anything (sessions are plain random tokens hashed into the database, not JWTs) — kept as a reserved slot for any future use. Set it to a long random string anyway. |
| `ALLOWED_EMAIL_DOMAIN` | If set (e.g. `gpoc.co.ug`), only emails on that domain can register. Leave blank to allow any email. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | SMTP credentials for sending password-reset emails. Leave all blank for local dev — see above. |
| `CLINIC_PHONE`, `CLINIC_EMAIL` | Shown on the landing page footer. |

## 3. How the authentication works

Built from scratch, no hosted auth service:

- **Passwords** are hashed with bcrypt (12 rounds) via `bcryptjs`. Never
  stored or logged in plain text.
- **Sessions**: on login, the server generates a random 32-byte token,
  sends it to the browser in an `httpOnly`, `sameSite=lax` cookie (also
  `secure` in production), and stores only the **SHA-256 hash** of that
  token in the `Session` table alongside an `expiresAt`. A leaked database
  alone never hands over a usable session — you'd need the original cookie
  value too, which the server never stores.
- **`getCurrentUser()`** (`src/lib/auth.ts`) is the one place that reads the
  cookie, hashes it, looks up the session, and checks `expiresAt`. Every
  protected page and Server Action calls this directly — nothing trusts
  the cookie's mere presence.
- **`src/proxy.ts`** (Next 16's renamed `middleware.ts` convention) only checks that the session cookie *exists*, as a
  fast redirect for the obvious signed-out case. It is **not** the real
  security boundary — a stale or revoked cookie still gets caught by
  `getCurrentUser()`'s database check on the actual page/action.
- **"Remember me"** sets the session to expire in 30 days instead of 1.
- **Rate limiting**: every login attempt (success or failure) is recorded
  in the `LoginAttempt` table. 5+ failures for the same email *or* the same
  IP within a rolling 15-minute window blocks further attempts — stored in
  the database, so it survives a server restart, and self-heals as old
  failures age out of the window.
- **Forgot/reset password**: a single-use token (again, only its hash is
  stored) expiring in 1 hour. Resetting it invalidates every session for
  that user. Changing your password from the Account page does the same,
  except it immediately issues a fresh session for the browser you're
  using, so you don't get logged out of the request that just changed it.
- **CSRF**: every mutation is a Next.js Server Action, called either via a
  plain `<form action={...}>` or invoked directly from a client component.
  Server Actions are POST-only, same-origin by construction (Next rejects
  a Server Action request whose `Origin` header doesn't match the app's own
  origin), and the session cookie is `sameSite=lax` — so a cross-site page
  can't trigger an authenticated action on a signed-in user's behalf. There
  is no separate CSRF token because the action-invocation protocol already
  provides that guarantee.
- Every Zod schema runs **again on the server** inside the Server Action,
  even though the same schema already validates on the client via React
  Hook Form — a client-side check is just UX, never trusted as the real
  validation.

## 4. Deploying to a Linux VPS with Docker

1. **Build the image** (Node 22 — Prisma 7 requires it):

   ```bash
   docker build -t gpoc-evd .
   ```

2. **Run Postgres** somewhere reachable by the app container — either the
   `docker-compose.yml` in this repo (change the exposed port/credentials
   for production use) or a managed Postgres instance. Either way, set
   `DATABASE_URL` to point at it.

3. **Run migrations once**, before starting the app, against that same
   `DATABASE_URL`:

   ```bash
   docker run --rm --env-file .env.production gpoc-evd \
     npx prisma migrate deploy
   ```

4. **Start the app container:**

   ```bash
   docker run -d --name gpoc-evd \
     --env-file .env.production \
     -p 3000:3000 \
     gpoc-evd
   ```

5. **Put it behind Nginx with HTTPS (Let's Encrypt):**

   ```nginx
   server {
       listen 80;
       server_name evd.gpoc.co.ug;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Then:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d evd.gpoc.co.ug
   ```

   Certbot rewrites the Nginx config to redirect to HTTPS and sets up
   auto-renewal.

6. **Back up Postgres daily with `pg_dump` + cron:**

   ```bash
   # /etc/cron.d/gpoc-evd-backup
   0 2 * * * root pg_dump "$DATABASE_URL" | gzip > /var/backups/gpoc-evd-$(date +\%F).sql.gz
   ```

   Consider also pruning backups older than 30 days and copying them
   off-box (e.g. to S3) — a daily cron that only writes to the same disk
   the database lives on doesn't protect against disk failure.

## 5. Where to edit things

| What | File |
|---|---|
| Ebola awareness text on the landing page | `src/content/awareness.ts` — **the GPOC health team should review this before launch**, per the comment at the top of that file. |
| The 10 clinical screening questions (wording, which ones trigger a review) | `src/lib/questions.ts` — used by the form, the pass page, the PDF, and the QR text, so it only needs changing in one place. |
| The logo | Drop a `logo.svg` into `/public/`. `src/components/Logo.tsx` automatically uses it instead of the "GPOC" text wordmark once it exists — no code changes needed. |
| Clinic phone/email shown on the landing page and pass | `CLINIC_PHONE` / `CLINIC_EMAIL` in `.env`. |
| Allowed registration email domain | `ALLOWED_EMAIL_DOMAIN` in `.env`. |
| Colours / type / spacing | CSS custom properties in `src/app/globals.css`. |

## What was built

- Landing page with the Ebola awareness content and a path to sign in/register.
- Full auth from scratch: register, login (with rate limiting), logout,
  forgot/reset password, change password, account details.
- The 4-section screening form (personal, travel, clinical, declaration)
  with the "contact the clinic" warning, automatic duration calculation,
  and a generated `EVD-YYYYMMDD-XXXX` reference number.
- The QR travel pass page — QR code, status badge, full-answers list,
  downloadable PNG (with the reference printed under the code) and PDF,
  and a print stylesheet.
- Travel history with search, status/year filters, and pagination.
- Every screening query scoped to `userId`; opening someone else's
  screening (by ID, QR PNG, or PDF) returns a 404, never a 403.
- Docker Compose for local Postgres, a production Dockerfile, a seed
  script, and a Vitest suite covering the status calculation, reference
  number format, QR text layout, the screening Zod schema, and the
  password/token helpers.

## Still needed from you

- **The real logo** — drop `logo.svg` into `/public/` (see the table above).
- **Clinic phone number and email** — set `CLINIC_PHONE` / `CLINIC_EMAIL`.
- **SMTP credentials** for real password-reset emails in production (local
  dev works without them via the console fallback).
- **Whether to restrict registration to a company email domain** — set
  `ALLOWED_EMAIL_DOMAIN` if so (e.g. `gpoc.co.ug`), or leave it blank.
- **Review of the awareness text** in `src/content/awareness.ts` by the
  health team before launch, per the comment at the top of that file.
