# E-Commerce Backend API

Hệ thống backend Python (FastAPI + SQLite) cho sàn thương mại điện tử thiết bị nhà bếp.

## Tính Năng Chính

✅ **Xác thực người dùng** (Register, Login, JWT)  
✅ **Quản lý sản phẩm** (CRUD, images, attributes)  
✅ **Tìm kiếm nâng cao** (Fuzzy search + dynamic filters)  
✅ **Thanh toán** (Stripe Sandbox + Webhook)  
✅ **Quản lý kho** (Auto decrement on payment success)  
✅ **Upload ảnh** (Cloudinary integration)  
✅ **Lưu trữ** (SQLite với persistence đầy đủ)

---

## Cài Đặt

### 1. Tạo Virtual Environment

```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# hoặc: source venv/bin/activate  # macOS/Linux
```

### 2. Cài Đặt Dependencies

```bash
pip install -r requirements.txt
```

### 3. Tạo File .env

```bash
cp .env.example .env
# Sửa các giá trị trong .env (Stripe keys, Cloudinary, etc.)
```

### 4. Khởi Tạo Database

```bash
python -c "from backend.db import init_db; init_db()"
```

### 5. Chạy Server

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại: `http://localhost:8000`

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Đăng ký tài khoản
- `POST /api/auth/login` — Đăng nhập
- `GET /api/auth/me` — Thông tin user hiện tại

### Products

- `GET /api/products/` — Danh sách sản phẩm (pagination)
- `GET /api/products/{product_id}` — Chi tiết sản phẩm
- `GET /api/products/search/query` — Tìm kiếm nâng cao (fuzzy + filter)

### Checkout

- `POST /api/checkout/` — Tạo đơn hàng & thanh toán
- `POST /api/checkout/webhook/stripe` — Webhook từ Stripe
- `GET /api/checkout/{order_id}` — Chi tiết đơn hàng
- `GET /api/checkout/user/history` — Lịch sử đơn hàng user

### Admin

- `POST /api/admin/products` — Tạo sản phẩm (requires admin)
- `PATCH /api/admin/products/{product_id}` — Cập nhật sản phẩm
- `DELETE /api/admin/products/{product_id}` — Xóa sản phẩm
- `POST /api/admin/products/{product_id}/images` — Upload ảnh

---

## Ví Dụ Curl

### 1. Đăng Ký

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "id": "user-uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Danh Sách Sản Phẩm

```bash
curl http://localhost:8000/api/products/
```

### 3. Tìm Kiếm (Fuzzy + Filter)

```bash
curl "http://localhost:8000/api/products/search/query?q=lò&brand=Bosch&min_price=1000000&max_price=5000000&page=0&size=10"
```

### 4. Tạo Đơn Hàng (Checkout)

```bash
curl -X POST http://localhost:8000/api/checkout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "cart": [
      {"productId": 1, "quantity": 2}
    ],
    "shippingInfo": {
      "fullName": "Nguyễn Văn A",
      "phone": "0901234567",
      "address": "123 Đường ABC, TP HCM"
    },
    "paymentMethod": "stripe"
  }'
```

**Response:**

```json
{
  "orderId": "order-uuid",
  "redirect_url": "https://checkout.stripe.com?payment_intent=...",
  "total": 29999900,
  "status": "pending"
}
```

Front-end sẽ redirect tới `redirect_url` để thanh toán.

### 5. Webhook Stripe (Mô Phỏng)

```bash
curl -X POST http://localhost:8000/api/checkout/webhook/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=1234567890,v1=signature_here" \
  -d '{
    "id": "evt_test",
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test_id",
        "status": "succeeded"
      }
    }
  }'
```

Khi webhook được xác nhận, order sẽ được cập nhật thành `"paid"` và stock sẽ giảm.

### 6. Upload Ảnh Sản Phẩm (Admin)

```bash
curl -X POST http://localhost:8000/api/admin/products/1/images \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**Response:**

```json
{
  "id": "image-uuid",
  "url": "https://res.cloudinary.com/...",
  "is_primary": true
}
```

### 7. Lịch Sử Đơn Hàng

```bash
curl http://localhost:8000/api/checkout/user/history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Database Schema (SQLite)

### users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  hashed_password TEXT,
  role TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### products

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  price REAL,
  category TEXT,
  brand TEXT,
  stock INTEGER,
  status TEXT,
  attributes JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### orders

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT FOREIGN KEY,
  status TEXT,
  total REAL,
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  shipping_info JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Cấu Hình Payment Gateway (Stripe)

1. Đăng ký account: https://dashboard.stripe.com
2. Lấy API keys từ Dashboard (sk*test*...)
3. Thêm vào `.env`:
   ```
   STRIPE_API_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```
4. Cấu hình Webhook endpoint (optional):
   - URL: `http://yourdomain.com/api/checkout/webhook/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## Cấu Hình Cloudinary (Image Upload)

1. Đăng ký: https://cloudinary.com
2. Lấy credentials từ Dashboard
3. Thêm vào `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## Tính Năng Tìm Kiếm Nâng Cao

### Query Parameters

```
GET /api/products/search/query
  ?q=string           # Tìm kiếm theo tên/description (fuzzy)
  &brand=string       # Lọc theo thương hiệu
  &min_price=number   # Giá tối thiểu
  &max_price=number   # Giá tối đa
  &category=string    # Lọc theo danh mục
  &page=number        # Trang (0-indexed)
  &size=number        # Số items trên trang
  &sort_by=string     # "created_at", "price", "rating"
  &sort_order=string  # "asc" hoặc "desc"
```

### Ví Dụ

```bash
# Tìm sản phẩm có tên chứa "lò" hoặc "oven", giá 1M-5M, thương hiệu Bosch
curl "http://localhost:8000/api/products/search/query?q=lò&brand=Bosch&min_price=1000000&max_price=5000000"

# Tìm kiếm (sai chính tả) → fuzzy match
curl "http://localhost:8000/api/products/search/query?q=tủ lạn"  # Sẽ match "tủ lạnh"
```

### Thuật Toán Fuzzy Search

- Dùng **RapidFuzz** để tính similarity giữa query và product name/description
- Threshold mặc định: 50% similarity
- Sắp xếp theo score từ cao xuống thấp

---

## Testing

### Chạy Unit Tests

```bash
pytest backend/tests/test_api.py -v
```

### Test Coverage

```bash
pytest backend/tests/test_api.py --cov=backend --cov-report=html
```

---

## Tương Thích Front-End

### Lấy Access Token từ Register/Login

Front-end nhận `access_token` từ response login, lưu vào state/localStorage.

### Gửi API Request với Token

```javascript
const resp = await fetch('/api/checkout/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    cart: [...],
    shippingInfo: {...},
    paymentMethod: 'stripe'
  })
});
const data = await resp.json();
if (data.redirect_url) {
  window.location.href = data.redirect_url;  // Redirect to Stripe
}
```

### Webhook Callback

- Stripe sẽ gọi webhook backend → Order được cập nhật
- Front-end có thể poll `/api/checkout/{order_id}` để check status

---

## Deployment (Production Checklist)

- [ ] Dùng Postgres thay SQLite (production database)
- [ ] Set `DEBUG=False`
- [ ] Đổi `SECRET_KEY` (random string dài)
- [ ] Dùng HTTPS (ngay cả cho sandbox)
- [ ] Cấu hình CORS để chỉ allow domain chính
- [ ] Kích hoạt rate limiting
- [ ] Dùng docker + nginx + gunicorn
- [ ] Backup database định kỳ
- [ ] Monitor logs và metrics

---

## File Structure

```
backend/
├── main.py              # FastAPI entry point
├── config.py            # Cấu hình (env vars)
├── db.py                # SQLAlchemy setup
├── models/
│   └── orm.py           # ORM models (User, Product, Order, etc.)
├── services/
│   ├── auth.py          # Auth & JWT logic
│   ├── payment.py       # Stripe integration
│   └── search.py        # Fuzzy search + filtering
├── api/
│   ├── auth.py          # /api/auth/* routes
│   ├── products.py      # /api/products/* routes
│   ├── checkout.py      # /api/checkout/* routes
│   └── admin.py         # /api/admin/* routes
├── tests/
│   └── test_api.py      # Unit tests
└── __init__.py
```

---

## Ghi Chú & Next Steps

1. **Bảo mật:** Hiện tại demo lưu password dưới dạng hash bcrypt. Không lưu sensitive data trong localStorage client-side.

2. **Migrations:** Để thêm fields vào DB, cập nhật `models/orm.py` rồi gọi `init_db()` lại (chỉ phù hợp dev; dùng Alembic cho production).

3. **Scaling:** Nếu traffic tăng, chuyển sang Postgres, thêm Redis cache, và load balancer.

4. **Admin Dashboard:** Có thể mở rộng frontend để add admin panel cho quản lý sản phẩm/kho qua `/api/admin` endpoints.

---

## Support & Issues

Nếu có issue:

1. Check `.env` file (keys chính xác không?)
2. Xem console/logs của server
3. Dùng DevTools (Application → Network) để inspect requests/responses
4. Test curl endpoints trước khi test từ frontend

---

**Happy coding! 🚀**
