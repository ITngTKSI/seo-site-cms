# Domain Setup Guide - 11raja.com

## Overview

- **Main Blog Site**: `11raja.com` (hosted on Cloudflare Pages)
- **Strapi Admin**: `strapi.11raja.com` (hosted on your Digital Ocean droplet)

## Step 1: DNS Configuration in Cloudflare

### For Main Site (11raja.com)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select domain `11raja.com`
3. Go to **DNS** → **Records**

**Add/Update these records:**

**A Record for Root Domain:**
- **Type**: `A`
- **Name**: `@` (or leave blank for root)
- **IPv4 address**: `(Cloudflare Pages will provide this - usually automatic)`
- **Proxy status**: 🟠 Orange cloud (Proxied)
- **Note**: If using Cloudflare Pages, you might use a CNAME instead

**CNAME for Root Domain (if Cloudflare Pages requires it):**
- **Type**: `CNAME`
- **Name**: `@`
- **Target**: `your-pages-project.pages.dev` (or custom domain from Pages)
- **Proxy status**: 🟠 Orange cloud (Proxied)

### For Strapi Admin (strapi.11raja.com)

**A Record for Strapi:**
- **Type**: `A`
- **Name**: `strapi`
- **IPv4 address**: `64.227.153.182` (your droplet IP)
- **Proxy status**: ⚪ Gray cloud (DNS only) - **Important!**
- Click **Save**

## Step 2: Cloudflare Pages Setup

1. Go to **Pages** → Your project
2. Go to **Custom domains**
3. Add custom domain: `11raja.com`
4. Cloudflare will provide DNS instructions (usually automatic)
5. Wait for DNS verification (usually instant)

## Step 3: Nginx Proxy Manager Setup for Strapi

1. Access Nginx Proxy Manager: `http://64.227.153.182:81`
2. Go to **Proxy Hosts** → **Add Proxy Host**

**Details Tab:**
- **Domain Names**: `strapi.11raja.com`
- **Scheme**: `http`
- **Forward Hostname/IP**: `localhost` (or `127.0.0.1`)
- **Forward Port**: `1337`
- ✅ **Block Common Exploits**
- ✅ **Websockets Support** (important for Strapi admin)

**SSL Tab:**
- Click **SSL Certificate**
- Select **Request a new SSL Certificate**
- ✅ **Force SSL**
- ✅ **HTTP/2 Support**
- ✅ **I Agree to the Let's Encrypt Terms of Service**
- Click **Save**

Wait 1-2 minutes for SSL certificate to be issued.

## Step 4: Update Strapi Environment

On your droplet:

```bash
cd /opt/seo-site-cms
nano .env
```

Update:
```env
STRAPI_URL=https://strapi.11raja.com
PUBLIC_STRAPI_URL=https://strapi.11raja.com
```

Restart Strapi:
```bash
docker compose restart strapi
```

## Step 5: Cloudflare Pages Environment Variable

1. Go to **Pages** → Your project → **Settings** → **Environment Variables**
2. Add:
   - **Variable name**: `PUBLIC_STRAPI_URL`
   - **Value**: `https://strapi.11raja.com`
   - **Environment**: All (Production, Preview, Branch deploys)
3. Click **Save**
4. **Redeploy** your site

## Step 6: Verify Setup

### Test Main Site:
- Visit: `https://11raja.com`
- Visit: `https://11raja.com/cricket` (should show content from Strapi)

### Test Strapi Admin:
- Visit: `https://strapi.11raja.com/admin`
- Should show Strapi login page

### Test Admin Redirect:
- Visit: `https://11raja.com/admin`
- Should redirect to `https://strapi.11raja.com/admin`

## Troubleshooting

### Main site not loading:
- Check Cloudflare Pages deployment status
- Verify DNS records in Cloudflare
- Check if custom domain is verified in Pages

### Strapi admin not loading:
- Verify DNS A record for `strapi.11raja.com` is set to gray cloud (DNS only)
- Check Nginx Proxy Manager proxy host configuration
- Verify Strapi container is running: `docker compose ps`
- Check SSL certificate status in Nginx Proxy Manager

### Content not showing on main site:
- Verify `PUBLIC_STRAPI_URL` is set in Cloudflare Pages environment variables
- Check browser console for API errors
- Verify Strapi permissions are set (Public role → find, findOne)
- Ensure content is published in Strapi

## Final URLs

- **Main Blog**: `https://11raja.com`
- **Cricket News**: `https://11raja.com/cricket`
- **Strapi Admin**: `https://strapi.11raja.com/admin`
- **Admin Redirect**: `https://11raja.com/admin` → redirects to Strapi

