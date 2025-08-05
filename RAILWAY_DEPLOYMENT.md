# Railway Deployment Guide for Yearn GPT

This guide will help you deploy your Yearn GPT application to Railway.

## Prerequisites

- [Railway Account](https://railway.app/) (with credits added)
- [Supabase Account](https://supabase.com/) for PostgreSQL database
- [Upstash Account](https://upstash.com/) for Redis (optional, can use Railway Redis)

## Quick Deploy (Recommended)

1. **Click the Railway Deploy Button:**
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/TXdjD7?referralCode=olbszX)

2. **Follow the setup wizard and provide the required environment variables**

## Manual Deployment

### Step 1: Set up Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository
5. Railway will automatically detect the `railway.json` configuration

### Step 2: Set up Database (Supabase)

1. **Create Supabase Project:**

   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization
   - Enter project name (e.g., "yearn-gpt-db")
   - Set a strong database password
   - Choose a region close to your Railway deployment
   - Click "Create new project"

2. **Get Database URL:**
   - In your Supabase project, go to Settings → Database
   - Select "Session Mode" (not Connection Pool)
   - Choose "Node.js" as the URL format
   - Copy the `DATABASE_URL`
   - Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Set up Redis (Upstash or Railway)

**Option A: Upstash Redis**

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the `REDIS_URL`

**Option B: Railway Redis**

1. In your Railway project, click "New Service"
2. Select "Redis"
3. Railway will provide the connection details

### Step 4: Configure Environment Variables

In your Railway project settings, add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Redis (if using Upstash)
DB_REDIS_URL=redis://[USERNAME]:[PASSWORD]@[HOST]:[PORT]

# Application Settings
NODE_ENV=production
PORT=3000

# Optional: Google OAuth (if using Google login)
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_CLIENT_REDIRECT_URL=https://your-domain.railway.app/api/v1/google-oauth-login/callback

# Optional: Stripe (if using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Optional: AI Provider Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
COHERE_API_KEY=your_cohere_api_key
```

### Step 5: Deploy

1. Railway will automatically build and deploy your application
2. The build process may take 5-10 minutes
3. Once deployed, Railway will provide a public URL

### Step 6: Verify Deployment

1. Visit your Railway app URL
2. Check that the application loads correctly
3. Test the basic functionality

## Environment Variables Reference

### Required Variables

| Variable       | Description                  | Example                                           |
| -------------- | ---------------------------- | ------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@host:5432/dbname` |
| `DB_REDIS_URL` | Redis connection string      | `redis://username:password@host:port`             |
| `NODE_ENV`     | Environment mode             | `production`                                      |

### Optional Variables

| Variable                     | Description                | Example              |
| ---------------------------- | -------------------------- | -------------------- |
| `PORT`                       | Application port           | `3000`               |
| `GOOGLE_OAUTH_CLIENT_ID`     | Google OAuth client ID     | `your_client_id`     |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret | `your_client_secret` |
| `STRIPE_SECRET_KEY`          | Stripe secret key          | `sk_test_...`        |
| `OPENAI_API_KEY`             | OpenAI API key             | `sk-...`             |
| `ANTHROPIC_API_KEY`          | Anthropic API key          | `sk-ant-...`         |
| `COHERE_API_KEY`             | Cohere API key             | `your_cohere_key`    |

## Troubleshooting

### Common Issues

1. **Build Fails:**

   - Check that all required environment variables are set
   - Ensure the Dockerfile.optimized exists
   - Check Railway logs for specific error messages

2. **Database Connection Issues:**

   - Verify `DATABASE_URL` is correct
   - Ensure Supabase project is active
   - Check if using "Session Mode" in Supabase

3. **Redis Connection Issues:**

   - Verify `DB_REDIS_URL` is correct
   - Check if Redis service is running
   - Ensure proper authentication

4. **Application Not Starting:**
   - Check Railway logs for startup errors
   - Verify all environment variables are set
   - Ensure database migrations have run

### Getting Help

- Check Railway logs in the dashboard
- Review the [Railway documentation](https://docs.railway.app/)
- Check the [original Railway guide](docs/guide/self-hosting-railway.md)

## Cost Optimization

- Railway charges based on usage
- Consider using Supabase's free tier for development
- Use Upstash's free tier for Redis
- Monitor your Railway usage in the dashboard

## Security Notes

- Never commit environment variables to your repository
- Use Railway's environment variable management
- Regularly rotate API keys
- Enable Railway's automatic HTTPS
