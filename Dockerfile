# Use Node.js as the base image
FROM node:16

# Install system-level dependencies for ImageMagick and Canvas
RUN apt-get update && apt-get install -y 
    imagemagick 
    libcairo2-dev 
    libpango1.0-dev 
    libjpeg-dev 
    libgif-dev 
    librsvg2-dev 
    ghostscript 
    && rm -rf /var/lib/apt/lists/*

# Fix ImageMagick security policy for Pango and PDF
RUN sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml 
    && sed -i 's/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-6/policy.xml

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Run the build commands from package.json
RUN npm run build

# Expose the port your app runs on
EXPOSE 7860
ENV PORT=7860

# Start the application
CMD ["npm", "start"]
