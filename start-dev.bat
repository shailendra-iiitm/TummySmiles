@echo off
echo 🚀 Starting Tummy Smiles Development Environment...
echo.

echo 📦 Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install

echo.
echo 🔧 Starting servers...
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
