@echo off
echo Starting RelayLoop in debug mode...
set VITE_OPTIMIZE=false
set VITE_DEBUG_AUTH=true
set VITE_DEBUG_ROUTES=true
set VITE_DEBUG_ADMIN_DASHBOARD=true
npm run dev
