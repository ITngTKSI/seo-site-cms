# Environment Variables Setup

## Local Development

1. **Create a `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your Strapi URL:**
   ```env
   PUBLIC_STRAPI_URL=https://strapi.11raja.com
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Cloudflare Pages Deployment

### Option 1: Environment Variables in Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → Your project (`seo-site-cms`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add variable**
5. Add:
   - **Variable name**: `PUBLIC_STRAPI_URL`
   - **Value**: `https://strapi.11raja.com`
   - **Environment**: Select all (Production, Preview, Branch deploys)
6. Click **Save**
7. **Redeploy** your site (or wait for next deployment)

### Option 2: Using Wrangler (CLI)

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set environment variable
wrangler pages project create seo-site-cms  # If project doesn't exist
# Or update via dashboard (Option 1 is easier)
```

## Verify Setup

After setting the environment variable:

1. **Build locally to test:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check that Strapi URL is being used:**
   - Visit `http://localhost:4321/cricket`
   - Check browser console for any API errors
   - Verify content loads from Strapi

3. **After Cloudflare Pages deployment:**
   - Visit your site: `https://cms.11raja.com/cricket`
   - Content should load from `https://strapi.11raja.com`

## Troubleshooting

- **"Cannot fetch from Strapi"**: Check that `PUBLIC_STRAPI_URL` is set correctly
- **CORS errors**: Make sure Strapi permissions are set (Public role → find, findOne)
- **Empty content**: Verify you've created and published content in Strapi

