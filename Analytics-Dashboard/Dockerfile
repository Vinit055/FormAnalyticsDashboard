# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /Analytics-Dashboard

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port Vite uses by default
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]