#!/bin/sh

# Run the renewal process
certbot renew --quiet

# Reload Nginx to apply the new certificates
nginx -s reload
