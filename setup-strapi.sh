#!/bin/bash

# Script to set up Strapi on the droplet

echo "Setting up Strapi..."

# Create directories
mkdir -p strapi-app
mkdir -p strapi-uploads

# Check if Strapi is already initialized
if [ ! -f "strapi-app/package.json" ]; then
    echo "Initializing Strapi..."
    cd strapi-app
    
    # Create Strapi app with PostgreSQL
    npx create-strapi-app@latest . --quickstart --no-run --dbclient postgres --dbhost postgres --dbport 5432 --dbname strapi --dbusername strapi --dbpassword ${DATABASE_PASSWORD}
    
    cd ..
    echo "Strapi initialized!"
else
    echo "Strapi already initialized, skipping..."
fi

echo "Setup complete!"

