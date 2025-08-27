@echo off
echo Starting RelayLoop in auth debug mode...
set VITE_DEBUG_AUTH=true
set VITE_DEBUG_ROUTES=true
set VITE_VERBOSE_AUTH=true
npm run dev
