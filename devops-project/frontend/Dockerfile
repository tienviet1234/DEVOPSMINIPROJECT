# ─── Frontend Dockerfile ────────────────────────────────────
FROM nginx:1.25-alpine

# Copy app files
COPY index.html /usr/share/nginx/html/index.html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
