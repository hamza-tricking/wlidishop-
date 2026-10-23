#!/usr/bin/env bash
# One-time setup of the wlidishop backend on the dmtart.pro server (safe to re-run).
# - code in /root/wlidishop, PM2 process "wlidishop", Nginx location /wlidishop/
# - port: reused from .env / existing Nginx location, otherwise the next free port after the highest one in Nginx
set -e

NAME=wlidishop
DIR=/root/$NAME
REPO=https://github.com/hamza-tricking/wlidishop-.git
NGINX=/etc/nginx/sites-enabled/dmtart.pro
CLIENT_URL="https://wlidishop.vercel.app,http://localhost:3000"

echo "== 1) Code"
if [ -d "$DIR/.git" ]; then
  cd "$DIR" && git pull --ff-only
else
  git clone "$REPO" "$DIR" && cd "$DIR"
fi
npm ci --omit=dev

echo "== 2) Port"
if [ -f .env ] && grep -q '^PORT=' .env; then
  PORT=$(grep '^PORT=' .env | cut -d= -f2)
elif grep -q "location /$NAME/" "$NGINX"; then
  PORT=$(awk -v n="location /$NAME/" 'index($0,n){f=1} f && /proxy_pass/ {print; exit}' "$NGINX" | grep -oE ':[0-9]+' | tr -d ':')
else
  LAST=$(grep -oE 'proxy_pass[[:space:]]+https?://(127\.0\.0\.1|localhost):[0-9]+' "$NGINX" | grep -oE '[0-9]+$' | sort -n | tail -1)
  PORT=$(( ${LAST:-5000} + 1 ))
  while ss -tln | grep -q ":$PORT "; do PORT=$((PORT + 1)); done
fi
echo "Port: $PORT"

echo "== 3) Environment"
if [ ! -f .env ]; then
  cat > .env <<EOF
PORT=$PORT
MONGO_URI=mongodb://127.0.0.1:27017/$NAME
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d
CLIENT_URL=$CLIENT_URL
API_URL=https://dmtart.pro/$NAME
NODE_ENV=production
EOF
  chmod 600 .env
  echo ".env created"
else
  sed -i "s#^CLIENT_URL=.*#CLIENT_URL=$CLIENT_URL#" .env
  echo ".env kept (CLIENT_URL refreshed)"
fi
mkdir -p uploads

echo "== 4) Seed data + admin (first run only)"
if [ ! -f .seeded ]; then
  npm run seed
  npm run create-admin
  touch .seeded
else
  echo "already seeded"
fi

echo "== 5) PM2"
if pm2 describe "$NAME" > /dev/null 2>&1; then
  pm2 restart "$NAME" --update-env
else
  pm2 start src/server.js --name "$NAME" --cwd "$DIR"
fi
pm2 save
pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true

echo "== 6) Nginx"
if grep -q "location /$NAME/" "$NGINX"; then
  echo "location /$NAME/ already present"
else
  mkdir -p /root/nginx-backups
  BK=/root/nginx-backups/dmtart.pro.$(date +%Y%m%d%H%M%S).bak
  cp "$NGINX" "$BK"
  LOC=/tmp/$NAME.location
  cat > "$LOC" <<EOF
    location /$NAME/ {
        proxy_pass http://127.0.0.1:$PORT/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 25M;
    }

EOF
  if grep -q '# SSE notifications' "$BK"; then
    MARK='# SSE notifications'
  else
    MARK='location / {'
  fi
  # Insert the block once, before the first marker line.
  awk -v f="$LOC" -v m="$MARK" 'BEGIN{while((getline l < f) > 0) b = b l "\n"} !done && index($0, m){printf "%s", b; done=1} {print}' "$BK" > "$NGINX"
  if nginx -t; then
    systemctl reload nginx
    echo "nginx reloaded (backup: $BK)"
  else
    cp "$BK" "$NGINX"
    echo "nginx -t failed, original config restored"
    exit 1
  fi
fi

echo "== 7) Health checks"
sleep 2
curl -fsS "http://127.0.0.1:$PORT/api/health" && echo || echo "local health check FAILED"
curl -fsS "https://dmtart.pro/$NAME/api/health" && echo || echo "public health check FAILED"
curl -fsS -o /dev/null -w "seed image: %{http_code}\n" "https://dmtart.pro/$NAME/files/seed-logo.png" || true
pm2 list | grep "$NAME" || true
echo "DONE port=$PORT"
