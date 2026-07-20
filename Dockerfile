# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies to run the build step)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the frontend (Vite builds into the dist/ directory)
RUN npm run build

# Expose port 3000 (which is server.js's listening port)
EXPOSE 3000

# Set Node environment to production
ENV NODE_ENV=production

# Run the backend Socket.IO server
CMD ["node", "server.js"]
