@echo off
echo ===================================================
echo Starting Executive Productivity Agent Prototype...
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "Executive Agent Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Launching React Vite Frontend on http://localhost:5173 ...
start "Executive Agent Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo Agent is running! 
echo Access Dashboard at: http://localhost:5173
echo Access API Docs at:  http://localhost:8000/docs
echo ===================================================
