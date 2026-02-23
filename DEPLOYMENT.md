# CricChain Staging Deployment Guide

Follow these steps to deploy the CricChain stack to staging environments (Supabase, Vercel, Render).

## 1. Database Deployment (Supabase)

1. Go to [Supabase](https://supabase.com/) and create a new project called `cricchain-staging`.
2. Wait for the database to provision.
3. Go to **Project Settings -> Database**.
4. Uncheck "Enable Connection Pooling" momentarily if you want the direct string, or use the Transaction mode pooler string for Prisma.
5. In your local `cricchain-nextjs` and `cricchain-admin` repositories, create a `.env.staging` file (or just update your `.env` temporarily for deployment).
6. Set the `DATABASE_URL` to your Supabase Transaction connection pool string (port 6543, `?pgbouncer=true&connection_limit=1`).
7. Set the `DIRECT_URL` to your Supabase Session connection string (port 5432).
8. **Push the schema:** Run the following command from `cricchain-nextjs`:
   ```bash
   npx prisma db push
   ```
   *(Note: For production, we will use `npx prisma migrate deploy`, but `db push` is fine for initializing staging).*
9. **Seed the database:**
   ```bash
   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```

## 2. ML Service Deployment (Render / Railway)

1. Create a new Web Service on [Render](https://render.com/) or [Railway](https://railway.app/).
2. Connect your GitHub repository and point it to the `cricchain-ml` subdirectory.
3. Choose the **Docker** environment. Render/Railway will automatically use the `Dockerfile` we created in `cricchain-ml/Dockerfile`.
4. Deploy the service.
5. Once deployed, copy the public URL (e.g., `https://cricchain-ml-staging.onrender.com`).

## 3. Web Apps Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and "Add New Project".
3. Import the `cricchain-nextjs` repository.
4. Set the Framework Preset to **Next.js**.
5. Do the same for the `cricchain-admin` repository.
6. **Environment Variables Config:** Add the following environment variables to *both* projects in Vercel before deploying:
   - `DATABASE_URL`: (Your Supabase Pooler URL)
   - `DIRECT_URL`: (Your Supabase Direct URL)
   - `NEXTAUTH_SECRET`: (Generate a secure random string: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: `https://your-vercel-domain.vercel.app` (Important: update this after the first deployment gives you a URL!)
   - `NEXT_PUBLIC_ML_URL`: (The Render URL from step 2)
   - `ADMIN_JWT_SECRET`: (Only required for the Admin project)

7. Click **Deploy**.

## Post-Deployment Actions

Once everything is deployed:
1. Update `NEXTAUTH_URL` in Vercel settings for both projects to match their final production URLs.
2. In Google Cloud Console, add the new Vercel domains to your OAuth Authorized Redirect URIs (e.g., `https://your-domain.vercel.app/api/auth/callback/google`).
3. Create an admin user via the database or log in through the Next.js app first to register, then manually bump their role in the Supabase Table Editor to `SUPER_ADMIN`.
