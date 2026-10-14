# Multi-stage production build for Hedbanz Football
# Stage 1: Build the static bundle
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build static HTML export
ENV NEXT_EXPORT=true
RUN npm run build:export

# Stage 2: Ultra-lightweight Nginx production web server (~25MB)
FROM nginx:alpine AS runner

# Copy custom Nginx configuration with gzip and SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static bundle from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
