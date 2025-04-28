# ========== Build Web App ==========
FROM node:20-alpine AS web

WORKDIR /home/node

# Copy root package files
COPY package*.json .npmrc ./

# Copy only web package.json
COPY web/package.json web/

# Install dependencies for web
RUN npm \
  --no-fund \
  --no-update-notifier \
  --workspace web \
  ci

# Copy web source
COPY web/ web/

# Build web app
RUN npm --workspace web run build

# ========== Build API ==========
FROM node:20-alpine

# Install tini
RUN apk add --no-cache tini

WORKDIR /home/node

# Copy root package files
COPY package*.json .npmrc ./

# Copy API package.json
COPY api/package.json api/

# Create node_modules folder with right permissions
RUN mkdir -p /home/node/api/node_modules

# Switch to node user
USER node

# Make sure API directory belongs to node
RUN chown -R node:node /home/node/api

# Install API dependencies
RUN npm \
  --no-fund \
  --no-update-notifier \
  --omit dev \
  --workspace api \
  ci

# Copy runtime files
COPY --chown=node bin/start.sh .
COPY --chown=node api/ api/
COPY --from=web /home/node/api/static api/static/

# Final settings
EXPOSE 80
ENV PORT=80

ENTRYPOINT ["./start.sh"]
