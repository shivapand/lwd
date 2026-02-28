# Use a modern Node.js version (Bookworm-based)
FROM node:20

# Install system-level dependencies in a single line to be safe
# We also add build-essential and pkg-config which canvas needs
RUN apt-get update && apt-get install -y imagemagick libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev ghostscript build-essential pkg-config && rm -rf /var/lib/apt/lists/*

# Fix ImageMagick security policy for both v6 and v7 paths
RUN if [ -f /etc/ImageMagick-6/policy.xml ]; then sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-6/policy.xml; fi
RUN if [ -f /etc/ImageMagick-7/policy.xml ]; then sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-7/policy.xml && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-7/policy.xml; fi

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Force install a modern version of canvas BEFORE installing the rest of the old dependencies
# This prevents the old node-gyp error
RUN npm install canvas@2.11.2

# Install dependencies (using --legacy-peer-deps for older package compatibility)
RUN npm install --legacy-peer-deps

# Copy code
COPY . .

# Build the app
RUN npm run build

# Port setup
EXPOSE 7860
ENV PORT=7860

# Start
CMD ["npm", "start"]
