FROM node:20-slim

WORKDIR /app

# openssl: dibutuhkan Prisma untuk mendeteksi engine yang benar
# poppler-utils: pdftotext, cadangan ekstrak teks PDF saat pdf-parse gagal
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    poppler-utils \
    libheif-examples \
    libde265-0 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .
RUN npx prisma generate

EXPOSE 5000

# Hanya menjalankan migrasi yang belum diterapkan (prisma/migrations), tidak pernah
# menghapus kolom/data diam-diam seperti `db push --accept-data-loss`.
# Ubah schema: `npx prisma migrate dev --name <nama>` di lokal, commit folder migrasinya.
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
