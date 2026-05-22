@echo off
cd /d "c:\E-commerce Website UI Design (1)"
echo.
echo ========================================
echo E-Commerce Backend Server
echo ========================================
echo.
echo Starting server at http://localhost:8000
echo API docs: http://localhost:8000/docs
echo.
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

