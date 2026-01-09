# Strapi CMS Setup Guide

This project uses Strapi CMS (self-hosted, completely free) for content management.

## Quick Start (Docker - Recommended)

### 1. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate secure secrets (run these commands):
   ```bash
   # Generate random secrets
   openssl rand -base64 32  # For JWT_SECRET
   openssl rand -base64 32  # For ADMIN_JWT_SECRET
   openssl rand -base64 32  # For APP_KEYS
   openssl rand -base64 32  # For API_TOKEN_SALT
   openssl rand -base64 32  # For TRANSFER_TOKEN_SALT
   ```

3. Update `.env` with your generated secrets and a secure database password.

### 2. Start Strapi with Docker

```bash
docker-compose up -d
```

This will:
- Start Strapi on `http://localhost:1337`
- Start PostgreSQL database
- Create necessary volumes for data persistence

### 3. Create Admin Account

1. Open `http://localhost:1337/admin`
2. Fill in the registration form to create your first admin user
3. Log in with your credentials

### 4. Create Content Type

1. Go to **Content-Type Builder** in the left sidebar
2. Click **Create new collection type**
3. Name it: `Cricket News`
4. Add the following fields:

   - **title** (Text, Short text, Required)
   - **slug** (Text, Short text, Required, Unique)
   - **publishDate** (Date, Date, Required)
   - **category** (Enumeration, Required)
     - Values: `IPL`, `T20`, `ODI`, `Test`
   - **featuredImage** (Media, Single media, Image)
   - **bannerImage** (Media, Single media, Image)
   - **bannerLink** (Text, Short text)
   - **body** (Rich text, Long text, Required)

5. Click **Save** and wait for Strapi to restart

### 5. Configure Permissions

1. Go to **Settings** → **Users & Permissions plugin** → **Roles** → **Public**
2. Under **Cricket News**, check:
   - `find` (to list all articles)
   - `findOne` (to view individual articles)
3. Click **Save**

### 6. Update Environment for Production

In your `.env` file, update:
```env
PUBLIC_STRAPI_URL=https://your-strapi-domain.com
STRAPI_URL=https://your-strapi-domain.com
```

## Deployment on Digital Ocean

### Option 1: Docker on Droplet (Recommended)

1. **Create a Droplet:**
   - Choose Ubuntu 22.04
   - Minimum: 2GB RAM, 1 vCPU (4GB recommended)
   - Add your SSH key

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Docker Compose:**
   ```bash
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   ```

4. **Clone your repo and set up:**
   ```bash
   git clone your-repo-url
   cd seo-lp-ito1817
   cp .env.example .env
   # Edit .env with production values
   ```

5. **Start Strapi:**
   ```bash
   docker compose up -d
   ```

6. **Set up Nginx reverse proxy** (optional but recommended):
   ```bash
   sudo apt install nginx
   ```

   Create `/etc/nginx/sites-available/strapi`:
   ```nginx
   server {
       listen 80;
       server_name your-strapi-domain.com;

       location / {
           proxy_pass http://localhost:1337;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable it:
   ```bash
   sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-strapi-domain.com
   ```

### Option 2: Manual Installation

If you prefer not to use Docker:

1. Install Node.js 18+ and PostgreSQL
2. Follow [Strapi installation guide](https://docs.strapi.io/dev-docs/installation)
3. Configure database connection
4. Run `npm run develop`

## Content Structure

The `Cricket News` content type includes:
- **Title** - Article title
- **Slug** - URL-friendly identifier (must be unique)
- **Publish Date** - When the article was published
- **Category** - IPL, T20, ODI, or Test
- **Featured Image** - Main article image
- **Khelraja Banner Image** - Banner ad image
- **Banner Link** - URL for the banner ad
- **Body** - Article content (Rich text)

## Accessing Content

- **CMS Interface**: `http://localhost:1337/admin` (or your production URL)
- **API**: `http://localhost:1337/api/cricket-news`
- **Public Pages**: 
  - List: `/cricket`
  - Individual: `/cricket/[slug]`

## Troubleshooting

- **"Cannot connect to database"**: Check your `.env` DATABASE_PASSWORD matches docker-compose.yml
- **"Port 1337 already in use"**: Change the port in docker-compose.yml
- **"Permission denied"**: Make sure you've set permissions in Settings → Roles → Public
- **Images not loading**: Check that PUBLIC_STRAPI_URL is set correctly

## Cost Estimate

- **Digital Ocean Droplet**: $6/month (2GB RAM) or $12/month (4GB RAM)
- **Strapi**: Free (open-source)
- **Total**: ~$6-12/month

## Backup

Strapi data is stored in:
- `./strapi-app` - Application files
- `./strapi-uploads` - Uploaded media
- Docker volume `postgres-data` - Database

Regular backups recommended!

