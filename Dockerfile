# Use a stable, modern Node.js version
FROM node:20-bookworm

# 1. Install system-level dependencies in a single line
RUN apt-get update && apt-get install -y imagemagick libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev ghostscript build-essential pkg-config python3 && rm -rf /var/lib/apt/lists/*

# 2. Fix ImageMagick security policy
RUN if [ -f /etc/ImageMagick-6/policy.xml ]; then sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-6/policy.xml; fi
RUN if [ -f /etc/ImageMagick-7/policy.xml ]; then sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-7/policy.xml && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-7/policy.xml; fi

# 3. Set up the working directory
WORKDIR /app
RUN mkdir -p media/output
RUN ln -s /app/media /media

# 4. Copy package files and install dependencies
# We use --legacy-peer-deps to handle older package versions
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 5. Copy the rest of your application code
COPY . .

# 6. Enable legacy OpenSSL provider for Webpack 4 compatibility
ENV NODE_OPTIONS=--openssl-legacy-provider

# 7. Build the application
RUN npm run build

# 8. Hugging Face port configuration
EXPOSE 7860
ENV PORT=7860

# 9. Start the application
CMD ["npm", "start"]
