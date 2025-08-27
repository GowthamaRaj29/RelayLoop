@echo off
echo Starting RelayLoop with optimizations...
set VITE_OPTIMIZE=true
set VITE_DEBUG_AUTH=false
set VITE_DEBUG_ROUTES=false
set VITE_DEBUG_ADMIN_DASHBOARD=false
npm run dev
