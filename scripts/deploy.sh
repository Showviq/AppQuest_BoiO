#!/usr/bin/env bash
# Redeploy the working tree to the Boi-O OTP server (AWS ap-south-1, see docs/01-decisions.md D-014).
# Usage (Git Bash): bash scripts/deploy.sh
# Ships tracked + untracked, non-ignored files. Never ships .env* or .data/ (server keeps its own).
set -euo pipefail

HOST="${BOIO_HOST:-ubuntu@65.0.242.101}"
KEY="${BOIO_KEY:-$HOME/.ssh/boio-otp.pem}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$(dirname "$0")/.."
git ls-files -co --exclude-standard | grep -v '^~\$' > "$TMP/files.txt"
tar -czf "$TMP/boio.tgz" -T "$TMP/files.txt"
scp -i "$KEY" -q "$TMP/boio.tgz" "$HOST:/tmp/boio.tgz"
ssh -i "$KEY" "$HOST" 'set -e
  cd /opt/boio
  # Replace code folders so files deleted locally disappear here too (.env*, .data/ untouched).
  rm -rf src public docs scripts
  tar -xzf /tmp/boio.tgz && rm /tmp/boio.tgz
  npm ci --no-audit --no-fund >/dev/null
  NODE_OPTIONS=--max-old-space-size=1536 npm run build >/dev/null
  sudo systemctl restart boio && sleep 3 && systemctl is-active boio'
echo "Deployed: https://65-0-242-101.sslip.io"
