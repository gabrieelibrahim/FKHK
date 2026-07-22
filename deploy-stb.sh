#!/bin/bash
set -e

echo "=== FKHK DEPLOY TO STB ==="
read -p "Tailscale IP STB (contoh: 100.x.x.x): " TS_IP
read -sp "Password PostgreSQL (fkhkuser): " DB_PASS
echo

# 1. Update & install deps
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs git nginx postgresql postgresql-client
sudo npm install -g pm2

# 2. Setup DB
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER fkhkuser WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE fkhkdb OWNER fkhkuser;" 2>/dev/null || true

# 3. Clone repo
cd /home
sudo rm -rf fkhk
git clone https://github.com/gabrieelibrahim/FKHK.git fkhk
sudo chown -R $USER:$USER fkhk

# 4. Backend env
cat > /home/fkhk/fkhk-website/backend/.env << ENVEOF
PORT=3001
DATABASE_URL="postgresql://fkhkuser:$DB_PASS@localhost:5432/fkhkdb?schema=public"
JWT_SECRET=fkhk_prod_secret_2026_$(date +%s)
BCRYPT_SALT_ROUNDS=10
FRONTEND_URL=http://$TS_IP:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=FKHK <noreply@fkhk.com>
ENVEOF

# 5. Frontend env
cat > /home/fkhk/fkhk-website/frontend/.env.local << ENVEOF
NEXT_PUBLIC_API_URL=http://$TS_IP:3001
ENVEOF

# 6. Install deps
cd /home/fkhk/fkhk-website/backend && npm install
cd /home/fkhk/fkhk-website/frontend && npm install && npm run build

# 7. Database seed
cd /home/fkhk/fkhk-website/backend
npx prisma generate
npx prisma db push 2>/dev/null || npx prisma db push --force-reset
npx prisma db seed 2>/dev/null || echo "Seed skipped (if any)"

# 8. PM2
pm2 delete fkhk-backend 2>/dev/null || true
pm2 delete fkhk-frontend 2>/dev/null || true
cd /home/fkhk/fkhk-website/backend && pm2 start src/index.js --name fkhk-backend
cd /home/fkhk/fkhk-website/frontend && pm2 start npm --name fkhk-frontend -- start
pm2 save
pm2 startup 2>/dev/null

echo ""
echo "=== DEPLOY SELESAI ==="
echo "Frontend: http://$TS_IP:3000"
echo "Backend:  http://$TS_IP:3001"
echo ""
echo "SMTP masih kosong. Isi nanti di:"
echo "  nano /home/fkhk/fkhk-website/backend/.env"
echo "  lalu: pm2 restart fkhk-backend"
