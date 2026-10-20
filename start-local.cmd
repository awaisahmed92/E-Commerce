@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title Khairpur Dates House - Local Development

echo.
echo ============================================================
echo   Khairpur Dates House - Local Development
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found.
  echo Install Node.js 20 or newer from https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found.
  echo Reinstall Node.js with npm enabled.
  pause
  exit /b 1
)

if not exist ".env" (
  echo No .env file was found.
  copy /Y ".env.example" ".env" >nul
  echo.
  echo A new .env file has been created and will open in Notepad.
  echo Set DATABASE_URL and JWT_SECRET, save the file, then run
  echo start-local.cmd again.
  echo.
  start "" notepad ".env"
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [1/4] Installing dependencies...
  call npm install
  if errorlevel 1 goto :failed
) else (
  echo [1/4] Dependencies are already installed.
)

if exist ".local-setup-complete" goto :already_setup

echo [2/4] Preparing the PostgreSQL database...
call npm run db:push
if errorlevel 1 goto :database_failed

echo.
echo Create the initial administrator account.
set "ADMIN_EMAIL=admin@khairpurdateshouse.com"
set "ADMIN_EMAIL_INPUT="
set /p "ADMIN_EMAIL_INPUT=Admin email [admin@khairpurdateshouse.com]: "
if defined ADMIN_EMAIL_INPUT set "ADMIN_EMAIL=%ADMIN_EMAIL_INPUT%"

set "ADMIN_PASSWORD="
set /p "ADMIN_PASSWORD=Admin password: "
if not defined ADMIN_PASSWORD goto :password_required

set "SEED_ADMIN_EMAIL=%ADMIN_EMAIL%"
set "SEED_ADMIN_PASSWORD=%ADMIN_PASSWORD%"

echo [3/4] Loading the Khairpur date catalog...
call npm run db:seed
if errorlevel 1 goto :failed

> ".local-setup-complete" echo Local setup completed successfully.
echo Initial setup completed.
goto :start_application

:already_setup
echo [2/4] Database setup has already been completed.
echo [3/4] Existing catalog and inventory will be preserved.
goto :start_application

:database_failed
echo.
echo Database setup failed. Confirm PostgreSQL is running and
echo DATABASE_URL in .env is correct.
goto :failed

:password_required
echo ERROR: An administrator password is required.
goto :failed

:start_application

echo [4/4] Starting the application...
echo.
echo Storefront:  http://localhost:3010
echo Admin login: http://localhost:3010/login
echo.
echo If port 3010 is busy, use the port printed below.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev
exit /b %errorlevel%

:failed
echo.
echo Setup stopped because a command failed.
pause
exit /b 1
