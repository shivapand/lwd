# Use a stable, modern Node.js version
FROM node:20-bookworm

# 1. Install system-level dependencies in one clean command
# Added build-essential, python3, and specific libraries for node-canvas
RUN apt-get update && apt-get install -y imagemagick libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev ghostscript build-essential pkg-config python3 && rm -rf /var/lib/apt/lists/*

# 2. Fix ImageMagick security policy
RUN if [ -f /etc/ImageMagick-6/policy.xml ]; then sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-6/policy.xml; fi
RUN if [ -f /etc/ImageMagick-7/policy.xml ]; then sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-7/policy.xml && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-7/policy.xml; fi

# 3. Set up the working directory
WORKDIR /app

# 4. Copy package files and install dependencies
# We use --legacy-peer-deps to handle your older package versions
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 5. Force update canvas if the install failed or produced an old version
RUN npm install canvas@2.11.2

# 6. Copy the rest of your application code
COPY . .

# 7. Enable legacy OpenSSL provider for Webpack 4 compatibility on Node 20
ENV NODE_OPTIONS=--openssl-legacy-provider

# 8. Build and prepare for runtime
RUN npm run build

# 9. Hugging Face specific port configuration
EXPOSE 7860
ENV PORT=7860

# 10. Start the application
CMD ["npm", "start"]
