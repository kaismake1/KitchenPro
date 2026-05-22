# 🚀 Quick Start - E-Commerce Backend

## Cấu Trúc Project

```
E-commerce Website UI Design (1)/
├── src/                           # Front-end React (Vite)
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── config.py                  # Configuration
│   ├── db.py                      # SQLAlchemy setup
│   ├── models/
│   │   └── orm.py                 # Database models
│   ├── services/
│   │   ├── auth.py                # JWT & password hashing
│   │   ├── search.py              # Fuzzy search + filters
│   │   └── payment.py             # Stripe integration
│   ├── api/
│   │   ├── auth.py                # Auth endpoints
│   │   ├── products.py            # Product endpoints
│   │   ├── checkout.py            # Checkout & orders
│   │   └── admin.py               # Admin operations
│   ├── tests/
│   │   └── test_api.py            # Unit tests
│   └── README.md                  # Detailed docs
├── requirements.txt               # Python dependencies
├── .env                           # Configuration file
├── run_backend.bat                # Windows server launcher
└── run_backend.sh                 # Unix server launcher
```

---

## 1️⃣ Khởi Tạo (First Time)

### Windows

```bash
# Open Command Prompt or PowerShell in project folder
cd "c:\E-commerce Website UI Design (1)"

# Create venv (if not exist)
python -m venv venv

# Activate venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -c "from backend.db import init_db; init_db()"

# ✅ Done! Move to step 2
```

### macOS / Linux

```bash
cd "E-commerce Website UI Design (1)"
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "from backend.db import init_db; init_db()"
```

---

## 2️⃣ Chạy Server

### Windows

```bash
# Double-click:
run_backend.bat

# Or manual:
venv\Scripts\activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### macOS / Linux

```bash
source venv/bin/activate
bash run_backend.sh
```

---

## 3️⃣ Test Server (Quick Check)

Server sẽ chạy tại: **http://localhost:8000**

### Check health

```bash
curl http://localhost:8000/health
# Response: {"status": "healthy"}
```

### View API docs

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 4️⃣ Cấu Hình (Optional)

### Stripe Payment (Sandbox)

1. Đăng ký: https://dashboard.stripe.com
2. Copy API keys từ Dashboard
3. Sửa `.env`:
   ```
   STRIPE_API_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Cloudinary Image Upload

1. Đăng ký: https://cloudinary.com
2. Copy credentials từ Dashboard
3. Sửa `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

---

## 5️⃣ Front-End Integration

### Cấu Hình CORS trong `.env`

```
FRONTEND_URL=http://localhost:5173
```

Backend sẽ allow requests từ frontend tại port 5173.

### Call API từ Front-End

```javascript
// Example: Register user
const resp = await fetch("http://localhost:8000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "john",
    email: "john@example.com",
    password: "pass123",
  }),
});
const data = await resp.json();
const token = data.access_token; // Store this!
```

---

## 6️⃣ Database

### SQLite File

Location: `c:\E-commerce Website UI Design (1)\ecommerce.db`

### Reset Database

```bash
rm ecommerce.db  # or del ecommerce.db (Windows)
python -c "from backend.db import init_db; init_db()"
```

### View Data (Optional)

```bash
pip install sqlite3-cli
sqlite3 ecommerce.db ".tables"
```

---

## 7️⃣ Testing

```bash
# Run all tests
pytest backend/tests/test_api.py -v

# With coverage
pytest backend/tests/test_api.py --cov=backend
```

---

## 📋 Checklist

- [ ] Virtual environment created and activated
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Database initialized: `python -c "from backend.db import init_db; init_db()"`
- [ ] Server running: `uvicorn backend.main:app --reload`
- [ ] Can access http://localhost:8000/health
- [ ] Front-end configured to call http://localhost:8000/api/\*
- [ ] (Optional) Stripe sandbox keys configured in `.env`
- [ ] (Optional) Cloudinary credentials configured in `.env`

---

## 🐛 Troubleshooting

| Problem                           | Solution                                                   |
| --------------------------------- | ---------------------------------------------------------- |
| `ModuleNotFoundError: sqlalchemy` | Run `pip install -r requirements.txt` again                |
| `port 8000 already in use`        | Change port: `uvicorn ... --port 8001`                     |
| `CORS error from frontend`        | Check `.env` FRONTEND_URL matches your frontend URL        |
| `Database locked`                 | Multiple processes accessing DB; close one server instance |
| `Payment webhook not working`     | Stripe test mode keys only work in sandbox; normal         |

---

## 📚 More Info

- Full API docs: [backend/README.md](backend/README.md)
- API endpoint examples: [backend/README.md](backend/README.md#ví-dụ-curl)
- Database schema: [backend/README.md](backend/README.md#database-schema-sqlite)

---

## 🎉 You're Ready!

```
Frontend (http://localhost:5173) ↔ Backend (http://localhost:8000)
         ↓
   SQLite Database (ecommerce.db)
```

Next steps:

1. Start backend: `python -m uvicorn backend.main:app --reload`
2. Start frontend: `npm run dev` (in another terminal)
3. Test complete flow: Register → Login → Add to cart → Checkout

**Happy coding! 🚀**
