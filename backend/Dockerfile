FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libheif-examples \
    libde265-0 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node src/index.js"]
