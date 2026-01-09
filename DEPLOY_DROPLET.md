# Deploying to Digital Ocean Droplet with Nginx Proxy Manager

## Prerequisites
- ✅ Digital Ocean Droplet created
- ✅ Nginx Proxy Manager installed
- ✅ Docker and Docker Compose installed

## Step 1: Connect to Your Droplet

```bash
ssh root@your-droplet-ip
# or
ssh your-user@your-droplet-ip
```

## Step 2: Clone Your Repository

```bash
# Navigate to a directory where you want to store the project
cd /opt  # or /home/your-user

# Clone your repository
git clone https://github.com/ITngTKSI/seo-site-cms.git
cd seo-site-cms

# Or if you haven't pushed yet, you can upload files via SCP or create the files directly
```

## Step 3: Create Environment File

```bash
# Create .env file
nano .env
# or
vim .env
```

Paste this content and fill in the values:

```env
# Strapi Configuration
STRAPI_URL=http://localhost:1337
PUBLIC_STRAPI_URL=https://your-strapi-domain.com

# Database Password (generate a strong password)
DATABASE_PASSWORD=your-very-secure-password-here

# Generate these secrets (run each command separately on your local machine or droplet)
# openssl rand -base64 32
JWT_SECRET=paste-generated-secret-here
ADMIN_JWT_SECRET=paste-generated-secret-here
APP_KEYS=paste-generated-secret-here
API_TOKEN_SALT=paste-generated-secret-here
TRANSFER_TOKEN_SALT=paste-generated-secret-here
```

**To generate secrets on the droplet:**
```bash
openssl rand -base64 32  # Run 5 times, copy each result to the corresponding variable
```

**Important:** 
- Replace `your-strapi-domain.com` with your actual domain (or IP for now)
- Use a strong password for `DATABASE_PASSWORD`
- Generate unique secrets for all JWT/APP keys

Save the file (Ctrl+X, then Y, then Enter in nano)

## Step 4: Start Strapi with Docker Compose

```bash
# Make sure you're in the project directory
cd /opt/seo-site-cms  # or wherever you cloned it

# Start Strapi
docker compose up -d

# Check if it's running
docker compose ps

# View logs (optional)
docker compose logs -f strapi
```

Wait about 30-60 seconds for Strapi to start.

## Step 5: Configure Nginx Proxy Manager

1. **Access Nginx Proxy Manager:**
   - Open your browser: `http://your-droplet-ip:81`
   - Default login: `admin@example.com` / `changeme`

2. **Create Proxy Host:**
   - Click **Proxy Hosts** → **Add Proxy Host**
   - **Details Tab:**
     - Domain Names: `strapi.yourdomain.com` (or your preferred subdomain)
     - Scheme: `http`
     - Forward Hostname/IP: `localhost` (or `127.0.0.1`)
     - Forward Port: `1337`
     - ✅ Block Common Exploits
     - ✅ Websockets Support (important for Strapi admin)
   
   - **SSL Tab:**
     - Request a new SSL Certificate
     - ✅ Force SSL
     - ✅ HTTP/2 Support
     - ✅ Agree to Terms
     - Click **Save**

3. **Update .env with your domain:**
   ```bash
   nano .env
   ```
   Update:
   ```env
   PUBLIC_STRAPI_URL=https://strapi.yourdomain.com
   ```
   
   Then restart Strapi:
   ```bash
   docker compose restart strapi
   ```

## Step 6: Access Strapi Admin

1. Visit: `https://strapi.yourdomain.com/admin`
2. Create your admin account (first time only)
3. Log in

## Step 7: Set Up Content Type

1. Go to **Content-Type Builder** → **Create new collection type**
2. Name: `Cricket News`
3. Add fields (see QUICKSTART.md for details):
   - `title` (Text, Short text, Required)
   - `slug` (Text, Short text, Required, Unique)
   - `publishDate` (Date, Required)
   - `category` (Enumeration, Required) - Values: `IPL`, `T20`, `ODI`, `Test`
   - `featuredImage` (Media, Single media)
   - `bannerImage` (Media, Single media)
   - `bannerLink` (Text, Short text)
   - `body` (Rich text, Long text, Required)
4. Click **Save**

## Step 8: Set Permissions

1. **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Under **Cricket News**, enable:
   - ✅ `find`
   - ✅ `findOne`
3. Click **Save**

## Step 9: Update Your Astro Site

In your Astro project's `.env` file (on your local machine or CI/CD):

```env
PUBLIC_STRAPI_URL=https://strapi.yourdomain.com
```

Then rebuild and deploy your Astro site to Cloudflare Pages.

## Troubleshooting

### Strapi won't start
```bash
# Check logs
docker compose logs strapi

# Check if port 1337 is in use
sudo netstat -tulpn | grep 1337

# Restart everything
docker compose down
docker compose up -d
```

### Can't access Strapi admin
- Check Nginx Proxy Manager logs
- Verify the proxy host is pointing to `localhost:1337`
- Make sure Strapi is running: `docker compose ps`
- Check Strapi logs: `docker compose logs strapi`

### Database connection errors
- Verify `DATABASE_PASSWORD` in `.env` matches docker-compose.yml
- Check if PostgreSQL container is running: `docker compose ps`
- View PostgreSQL logs: `docker compose logs postgres`

### SSL certificate issues
- Make sure your domain DNS points to your droplet IP
- Wait a few minutes for DNS propagation
- Check Nginx Proxy Manager SSL tab for errors

## Useful Commands

```bash
# View all running containers
docker compose ps

# View Strapi logs
docker compose logs -f strapi

# Restart Strapi
docker compose restart strapi

# Stop everything
docker compose down

# Start everything
docker compose up -d

# Update Strapi (pull latest image)
docker compose pull strapi
docker compose up -d
```

## Backup Strategy

Your data is stored in:
- `./strapi-app` - Strapi application files
- `./strapi-uploads` - Uploaded media files
- Docker volume `postgres-data` - Database

**To backup:**
```bash
# Backup database
docker compose exec postgres pg_dump -U strapi strapi > backup.sql

# Backup uploads
tar -czf uploads-backup.tar.gz strapi-uploads/
```

## Next Steps

1. ✅ Strapi is running
2. ✅ Content type created
3. ✅ Permissions set
4. Create your first article
5. Update Astro site's `PUBLIC_STRAPI_URL`
6. Deploy Astro site to Cloudflare Pages

