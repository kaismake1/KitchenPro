# 🔗 Frontend-Backend Integration Guide

**Hoàn thành!** ✅ Tất cả lỗi đã được sửa và hệ thống đã được tích hợp hoàn chỉnh.

---

## 📋 Những Gì Đã Được Tích Hợp

### ✅ 1. AuthContext.tsx (Fixed)

- ✅ Gọi API `/api/auth/register` thay vì localStorage
- ✅ Gọi API `/api/auth/login` thay vì hardcode
- ✅ Gọi API `/api/auth/me` để hydrate user
- ✅ Lưu `access_token` vào localStorage
- ✅ Trả về `accessToken` trong context

### ✅ 2. CheckoutPage.tsx (Fixed)

- ✅ Gọi API `/api/checkout/` để tạo order
- ✅ Gửi kèm token trong Authorization header
- ✅ Xóa đơn hàng khỏi database thực (không localStorage)

### ✅ 3. OrderHistoryPage.tsx (Fixed)

- ✅ Gọi API `/api/checkout/user/history` để fetch orders
- ✅ Hiển thị orders từ database

### ✅ 4. Products.tsx (Fixed)

- ✅ Gọi API `/api/products/` để fetch sản phẩm
- ✅ Hiển thị ảnh từ ProductImage collection
- ✅ Loading state khi fetch dữ liệu

### ✅ 5. Database (Seeded)

- ✅ 6 sản phẩm mẫu
- ✅ Admin account: `username=admin`, `password=123`
- ✅ Tất cả sản phẩm có ảnh từ Unsplash

---

## 🚀 Cách Chạy (Step by Step)

### Terminal 1: Start Backend Server

**Windows:**

```bash
cd "c:\E-commerce Website UI Design (1)"
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Or double-click:**

```
run_backend.bat
```

**macOS/Linux:**

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2: Start Frontend Dev Server

```bash
npm run dev
```

**Expected Output:**

```
VITE v6.3.5  ready in 123 ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Test Workflow

### 1. Tạo Tài Khoản Mới

1. Mở http://localhost:5173/
2. Click "Register" hoặc đi tới `/register`
3. Nhập:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Đăng Ký"
5. ✅ Check: Database `ecommerce.db` → table `users` → new user được thêm vào

**Verify in Database:**

```bash
# Windows PowerShell
sqlite3 ecommerce.db "SELECT * FROM users;"
```

### 2. Đăng Nhập

1. Logout hoặc mở tab mới
2. Click "Login"
3. Nhập username/password từ bước trên
4. ✅ Check: Stored token trong localStorage

### 3. Duyệt Sản Phẩm

1. Homepage → thấy 6 sản phẩm từ database
2. Click category filters → thấy sản phẩm được lọc
3. ✅ Check: API call in DevTools Network tab

### 4. Thêm Vào Giỏ Hàng

1. Click "Thêm Vào Giỏ" trên sản phẩm
2. Số lượng ↑ ở icon giỏ hàng
3. ✅ Check: localStorage → `cart-{userId}`

### 5. Thanh Toán (Checkout)

1. Click giỏ hàng → Checkout
2. Fill shipping info:
   - Tên: `Nguyễn Văn A`
   - Số điện thoại: `0123456789`
   - Địa chỉ: `123 Phố Bếp, Q1, TP.HCM`
3. Select thanh toán → COD
4. Click "Đặt Hàng"
5. ✅ Check:
   - Database → `orders` table → new order
   - Database → `order_items` table → order items
   - Hiển thị `/order-success` page

### 6. Lịch Sử Đơn Hàng

1. Click "Lịch Sử Đơn Hàng"
2. Thấy các orders vừa tạo
3. ✅ Check: API returns orders từ database

### 7. Admin Login

1. Logout
2. Login với:
   - Username: `admin`
   - Password: `123`
3. ✅ Check: Role = "admin"

---

## 📊 API Testing (Optional)

### Test Register

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Response:**

```json
{
  "id": "user-xxx",
  "username": "testuser",
  "email": "test@example.com",
  "role": "user",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Test Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123"
  }'
```

### Test Get Products

```bash
curl http://localhost:8000/api/products/
```

### Test Create Order

```bash
curl -X POST http://localhost:8000/api/checkout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "cart": [{"productId": 1, "quantity": 2}],
    "shippingInfo": {
      "fullName": "John Doe",
      "phone": "0123456789",
      "address": "123 Street"
    },
    "paymentMethod": "cod"
  }'
```

---

## 🔧 Troubleshooting

| Problem         | Solution                                              |
| --------------- | ----------------------------------------------------- |
| CORS error      | Backend running? Check `http://localhost:8000/health` |
| Login fails     | Check database → users table → user exists?           |
| Products empty  | Run seed: `python -m backend.seed_data`               |
| Token invalid   | Clear localStorage, login again                       |
| Order fails     | Check cart not empty, shipping info valid             |
| Database locked | Close other connections, restart backend              |

---

## 📁 Files Modified

### Frontend Files

- ✅ `src/app/context/AuthContext.tsx` — API calls
- ✅ `src/app/pages/CheckoutPage.tsx` — API calls
- ✅ `src/app/pages/OrderHistoryPage.tsx` — API calls
- ✅ `src/app/components/Products.tsx` — API calls

### Backend Files

- ✅ `backend/services/auth.py` — Fixed bcrypt
- ✅ `backend/seed_data.py` — New seed script
- ✅ `run_backend.bat` — New launcher

---

## 🎯 Architecture Diagram

```
Frontend (React)                Backend (FastAPI)
↓                               ↓
http://localhost:5173      http://localhost:8000
├ /register                 ├ POST /api/auth/register
├ /login                    ├ POST /api/auth/login
├ /products                 ├ GET /api/products/
├ /checkout                 ├ POST /api/checkout/
└ /order-history            ├ GET /api/checkout/user/history
                            └ SQLite Database
                                └ ecommerce.db
```

---

## ✅ Success Checklist

- [ ] Backend server running at port 8000
- [ ] Frontend server running at port 5173
- [ ] Can register new user → saved in database
- [ ] Can login with new user
- [ ] Can see 6 products from database
- [ ] Can add product to cart
- [ ] Can checkout and create order
- [ ] Order saved in database
- [ ] Can see order history
- [ ] Admin login works (username: admin, password: 123)

---

## 📞 Need Help?

1. Check **Browser DevTools** → Network tab → see API requests
2. Check **Backend Terminal** → error logs
3. Check **Database** with SQLite viewer
4. Read **backend/README.md** for full API docs

---

## 🎉 Done!

Hệ thống đã được tích hợp hoàn chỉnh! 🚀

**Database trống khi bạn bắt đầu → Giờ dữ liệu tự động lưu vào database SQLite**

Hãy test nó ngay bây giờ! 💻
