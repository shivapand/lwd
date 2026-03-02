FROM node:22

RUN apt-get update \
 && apt-get install -y imagemagick ghostscript \
 && rm -rf /var/lib/apt/lists/*

# allow ImageMagick to process PDF and LABEL
RUN [ -f /etc/ImageMagick-6/policy.xml ] \
 && sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/;s/rights="none" pattern="LABEL"/rights="read|write" pattern="LABEL"/' /etc/ImageMagick-6/policy.xml \
 || true

WORKDIR /app
RUN mkdir -p media/output && ln -s /app/media /media

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

EXPOSE 7860
ENV PORT=7860
CMD ["npm", "start"]
