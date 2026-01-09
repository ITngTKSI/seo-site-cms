# Strapi Vite Configuration for Development Mode

To fix the "host not allowed" error in development mode, create this file on your droplet:

## File: strapi-app/vite.config.js

```bash
cd /opt/seo-site-cms
nano strapi-app/vite.config.js
```

Paste this:

```javascript
export default {
  server: {
    host: '0.0.0.0',
    port: 1337,
    strictPort: true,
    hmr: {
      host: 'strapi.11raja.com',
    },
    allowedHosts: 'all',
  },
};
```

Then restart:
```bash
docker compose restart strapi
```

This allows all hosts and uses much less memory than production mode.

