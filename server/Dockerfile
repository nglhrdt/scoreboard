FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy yarn.lock if it exists
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY src ./src

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "src/server.js"]
