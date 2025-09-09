# Use smaller base image
FROM node:22-alpine

WORKDIR /app

# Install ALL dependencies (including dev dependencies untuk npm run dev)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Create user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use development server (tidak perlu build)
CMD ["npm", "run", "dev"]