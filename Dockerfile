# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN mkdir pages

# Install project dependencies
RUN npm install --legacy-peer-deps

RUN npm run build --no-warnings

# Copy the Strapi project files into the container
COPY . .

# Expose the port that Strapi will run on (default is 1337)
EXPOSE 3000

# Start the Strapi application
CMD ["npm", "start"]

