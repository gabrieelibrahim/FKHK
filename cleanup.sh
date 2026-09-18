#!/bin/bash
# FKHK Cleanup Script — Hapus FKHK deployment secara bersih
# Usage: bash /opt/fkhk-website/cleanup.sh

set -e

echo "🧹 Menghapus FKHK deployment..."

# Stop dan hapus containers + volumes
cd /opt/fkhk-website
docker compose down -v --rmi local 2>/dev/null || true

# Hapus folder FKHK
rm -rf /opt/fkhk-website

echo "✅ FKHK berhasil dihapus bersih!"
echo "   - Containers: dihapus"
echo "   - Volumes (DB data, uploads): dihapus"
echo "   - Docker images: dihapus"
echo "   - Folder /opt/fkhk-website: dihapus"
echo ""
echo "💡 Docker engine masih terinstall. Untuk uninstall Docker sepenuhnya:"
echo "   apt-get remove --purge docker-ce docker-ce-cli containerd.io"
