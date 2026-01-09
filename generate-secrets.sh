#!/bin/bash

# Script to generate Strapi secrets for .env file

echo "Generating Strapi secrets..."
echo ""
echo "Copy these values to your .env file:"
echo ""
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "APP_KEYS=$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo ""
echo "Also set a secure DATABASE_PASSWORD!"

