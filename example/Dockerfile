FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["bun", "start"]
