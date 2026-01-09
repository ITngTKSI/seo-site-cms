# Quick Start Guide - Strapi CMS

## 🚀 Get Started in 5 Minutes

### 1. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and generate secure secrets:
```bash
# Generate secrets (run each command separately)
openssl rand -base64 32  # Copy this to JWT_SECRET
openssl rand -base64 32  # Copy this to ADMIN_JWT_SECRET  
openssl rand -base64 32  # Copy this to APP_KEYS
openssl rand -base64 32  # Copy this to API_TOKEN_SALT
openssl rand -base64 32  # Copy this to TRANSFER_TOKEN_SALT
```

Set a secure `DATABASE_PASSWORD` too.

### 2. Start Strapi

```bash
docker compose up -d
```

Wait ~30 seconds for Strapi to start, then visit: **http://localhost:1337/admin**

### 3. Create Admin Account

Fill in the registration form on first visit.

### 4. Create Content Type

1. Go to **Content-Type Builder** → **Create new collection type**
2. Name: `Cricket News`
3. Add these fields:
   - `title` (Text, Short text, Required)
   - `slug` (Text, Short text, Required, Unique)
   - `publishDate` (Date, Required)
   - `category` (Enumeration, Required) - Values: `IPL`, `T20`, `ODI`, `Test`
   - `featuredImage` (Media, Single media)
   - `bannerImage` (Media, Single media)
   - `bannerLink` (Text, Short text)
   - `body` (Rich text, Long text, Required)
4. Click **Save**

### 5. Set Permissions

1. **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Under **Cricket News**, enable:
   - ✅ `find`
   - ✅ `findOne`
3. Click **Save**

### 6. Create Your First Article

1. Go to **Content Manager** → **Cricket News** → **Create new entry**
2. Fill in the fields
3. Click **Save** then **Publish**

### 7. Test Your Site

```bash
npm run dev
```

Visit: **http://localhost:4321/cricket**

## 📦 Deploy to Digital Ocean

See `STRAPI_SETUP.md` for detailed deployment instructions.

**Estimated cost: $6-12/month** (Droplet only, Strapi is free!)

## 🛠️ Useful Commands

```bash
# Start Strapi
npm run strapi:up

# Stop Strapi
npm run strapi:down

# View logs
npm run strapi:logs

# Restart Strapi
docker compose restart strapi
```

## ❓ Troubleshooting

- **Can't access admin**: Wait a bit longer, Strapi takes ~30s to start
- **Database errors**: Check your `.env` DATABASE_PASSWORD matches docker-compose.yml
- **Port in use**: Change port in docker-compose.yml (line with `1337:1337`)

