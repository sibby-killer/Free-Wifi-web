# FreeWiFi KE — VIBE Framework Implementation

This repo contains the FreeWiFi KE website built with **Next.js (App Router)** + **Prisma** + **Supabase Postgres** + **Clerk** + **Groq** + **Resend**.

> Note: The full product specification lives in `prompt.txt`.

## 1) Prerequisites

- Node.js **20.x**
- npm **10.x**+

From the `freewifike-app/` folder:

```bash
npm install
```

## 2) Environment Variables

Create a local env file:

```bash
cp .env.example .env
```

Then fill in the values below.

### A) Supabase Postgres (DATABASE_URL)

We use **Prisma** with **PostgreSQL**.

#### Steps to get your Supabase `DATABASE_URL`

1. Go to https://supabase.com and open your project (or create a new one).
2. In the Supabase dashboard, go to **Project Settings → Database**.
3. Find the section **Connection string**.
4. Choose **URI** format.
5. Copy the connection string and paste it into `.env` as `DATABASE_URL`.

Example (do not use this exact value):

```env
# Supabase requires SSL. Include sslmode=require.
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```

> If you see multiple options (pooler / direct): start with the default “URI” shown. If you deploy to serverless and hit connection limits later, we can switch to the Supabase pooler.

### B) Clerk (Authentication)

1. Create a Clerk application: https://dashboard.clerk.com
2. Go to **API Keys**.
3. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

Paste them into `.env`.

Optional (for webhooks):
- Create a webhook endpoint in Clerk → **Webhooks** and copy the signing secret into `CLERK_WEBHOOK_SECRET`.

### C) Groq (AI Chat)

1. Create an API key: https://console.groq.com/keys
2. Paste it into:

```env
GROQ_API_KEY="..."
```

### D) Resend (Email)

1. Create an API key: https://resend.com/api-keys
2. Paste it into:

```env
RESEND_API_KEY="..."
```

3. Set your sender:

```env
EMAIL_FROM="freewifiv4@gmail.com"
```

> In production, Resend typically requires you to verify a domain or sender identity. If you can’t send from `freewifiv4@gmail.com`, use a verified sender like `noreply@yourdomain.com`.

### E) App settings

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="freewifiv4@gmail.com"
WHATSAPP_NUMBER_PRIMARY="0762667048"
WHATSAPP_NUMBER_SECONDARY="0768294174"
```

## 3) Prisma setup (after DATABASE_URL is set)

Once you have pasted `DATABASE_URL` into `.env`:

```bash
npx prisma migrate dev --name init
```

To open Prisma Studio:

```bash
npx prisma studio
```

## 4) Run the app

```bash
npm run dev
```

Open http://localhost:3000

## 5) Deployment

- Recommended: Vercel
- Add the same `.env` variables in the Vercel project settings.
- Run:
  - Build Command: `npm run build`
  - Output: default Next.js

---

## 6) Current Implementation Status

✅ **Completed:**
- Landing page with hero, plans, coverage sections
- Secret admin access (click logo 4 times)
- User authentication (Clerk)
- User dashboard with TikTok-style navigation
- Admin dashboard with overview
- API routes for orders, reviews, chat, tickets
- Email notifications (Resend)
- Middleware with route protection
- Database schema (Prisma + Supabase)

🚧 **In Progress:**
- Dashboard tab functionality (reviews, chat, orders need backend connection)
- Custom user profile sync with Prisma
- Complete admin management pages

📝 See `IMPLEMENTATION_STATUS.md` for detailed status and next steps.

## 7) Creating an Admin User

Since we're using Clerk for authentication:

1. Sign up through the UI at `/sign-up`
2. Go to your Clerk Dashboard → Users
3. Find your user and click to edit
4. Under "Metadata" → "Public Metadata", add:
   ```json
   {"role": "admin"}
   ```
5. Save changes
6. Now you can access `/admin` or click the logo 4 times on the homepage

## Notes

- We intentionally do **not** implement features listed in the **Exclusions** section of `prompt.txt`.
- The Prisma User/Admin models exist but Clerk is the primary auth provider.
- Database migrations need to be run: `npx prisma migrate dev --name init`
