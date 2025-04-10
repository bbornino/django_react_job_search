#!/bin/sh

# Start cron in the background
crond

# Check if certificate already exists
if [ ! -f "/etc/letsencrypt/live/bornino.net/fullchain.pem" ]; then
    echo "No SSL certificate found, generating one using Certbot..."
    
    # Run Certbot to generate the certificate
    certbot --nginx -d bornino.net --non-interactive --agree-tos --email brianbornino@gmail.com
    # The --non-interactive flag ensures Certbot runs without requiring user input
    # The --agree-tos flag automatically agrees to Let's Encrypt's terms of service.
    
    echo "SSL certificate generation complete."
else
    echo "SSL certificate already exists."
fi
