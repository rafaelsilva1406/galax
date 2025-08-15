# Use Node.js official image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build stage for web
FROM base AS build-web
RUN npm run build:web

# Production stage for web deployment
FROM nginx:alpine AS production
COPY --from=build-web /app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM base AS development
EXPOSE 19006
CMD ["npm", "run", "web"]