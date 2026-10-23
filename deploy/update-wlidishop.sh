#!/usr/bin/env bash
# Pulls the latest backend code and restarts the wlidishop PM2 process.
set -e

NAME=wlidishop
DIR=/root/$NAME

cd "$DIR"
git pull --ff-only
npm ci --omit=dev
pm2 restart "$NAME" --update-env
pm2 save

PORT=$(grep '^PORT=' .env | cut -d= -f2)
sleep 2
curl -fsS "http://127.0.0.1:$PORT/api/health" && echo || echo "local health check FAILED"
curl -fsS "https://dmtart.pro/$NAME/api/health" && echo || echo "public health check FAILED"
