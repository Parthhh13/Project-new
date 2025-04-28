# Build stage for Frontend
FROM node:lts-alpine as frontend-build
WORKDIR /app/frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ .
RUN npm run build

# Build stage for Backend
FROM node:lts-alpine as backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ .

# Final stage
FROM node:lts-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./public

# Copy backend
COPY --from=backend-build /app/server ./server
COPY --from=backend-build /app/server/node_modules ./server/node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Set working directory to server
WORKDIR /app/server

# Start the server
CMD ["npm", "start"]
