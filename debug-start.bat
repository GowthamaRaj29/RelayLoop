@echo off
echo Starting RelayLoop application in development mode with debugging enabled...
echo.
echo ---- Environment Variables ----
echo VITE_SUPABASE_URL: %VITE_SUPABASE_URL%
echo VITE_SUPABASE_ANON_KEY: [First 10 chars only] %VITE_SUPABASE_ANON_KEY:~0,10%...
echo.

echo Checking for .env file...
if exist .env (
  echo .env file found.
) else (
  echo WARNING: .env file not found! Please create one with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  echo Example:
  echo VITE_SUPABASE_URL=https://your-project.supabase.co
  echo VITE_SUPABASE_ANON_KEY=your-anon-key
  pause
)

echo.
echo Starting development server with detailed logging...
npm run dev -- --debug

pause
