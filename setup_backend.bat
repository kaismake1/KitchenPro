@echo off
cd /d "c:\E-commerce Website UI Design (1)"
call venv\Scripts\activate
pip install -q sqlalchemy pydantic python-dotenv stripe cloudinary rapidfuzz bcrypt python-jose passlib email-validator
python -c "from backend.db import init_db; init_db(); print('✅ Database initialized')"
echo.
echo Backend setup complete!
echo.
echo To start server, run:
echo   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
pause
