#!/bin/bash
echo "Removing stale node_modules and lockfiles..."
cd /vercel/share/v0-project
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml
rm -f yarn.lock
echo "Running fresh npm install with legacy-peer-deps..."
npm install --legacy-peer-deps
echo "Install complete. Starting dev server check..."
npx next --version
echo "Done."
