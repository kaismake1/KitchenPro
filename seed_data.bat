@echo off
cd /d "c:\E-commerce Website UI Design (1)"
echo.
echo ========================================
echo Seeding Database with Products
echo ========================================
echo.
python backend\seed_data.py
echo.
pause
