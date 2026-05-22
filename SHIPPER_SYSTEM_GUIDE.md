# Hệ Thống Quản Lý Shipper - Hướng Dẫn Hoàn Chỉnh

## 📋 Tổng Quan Hệ Thống

Hệ thống shipper được thiết kế để:

- ✅ **Shippers** (nhân viên giao hàng) có thể xem và quản lý đơn hàng được giao
- ✅ **Admin** gán đơn hàng cho shippers
- ✅ **Customers** không bị ảnh hưởng - vẫn đặt hàng bình thường
- ✅ **Guest Checkout** vẫn hoạt động (không cần tài khoản)

## 🔄 Quy Trình Luồng

```
1. Khách hàng đặt hàng
   ↓
2. Admin xem đơn hàng
   ↓
3. Admin gán shipper cho đơn hàng
   ↓
4. Shipper nhận được đơn hàng trong dashboard
   ↓
5. Shipper cập nhật trạng thái: "Đã Giao" hoặc "Hủy"
   ↓
6. Khách hàng (nếu có tài khoản) thấy cập nhật trạng thái
```

## 🎯 Các Role Và Quyền

| Chức Năng                    | User | Shipper | Admin |
| ---------------------------- | ---- | ------- | ----- |
| Browse sản phẩm              | ✅   | ✅      | ✅    |
| Thêm giỏ hàng                | ✅   | ❌      | ❌    |
| Thanh toán                   | ✅   | ❌      | ❌    |
| Xem đơn hàng của mình        | ✅   | ❌      | ❌    |
| **Xem đơn hàng giao**        | ❌   | ✅      | ❌    |
| **Cập nhật trạng thái giao** | ❌   | ✅      | ❌    |
| Quản lý sản phẩm             | ❌   | ❌      | ✅    |
| Quản lý đơn hàng             | ❌   | ❌      | ✅    |
| **Gán shipper cho đơn**      | ❌   | ❌      | ✅    |
| **Tạo tài khoản shipper**    | ❌   | ❌      | ✅    |
| Quản lý users                | ❌   | ❌      | ✅    |

## 🚀 Hướng Dẫn Thiết Lập

### Bước 1: Reset Database (QUAN TRỌNG!)

Mô hình dữ liệu đã thay đổi. Cần reset database:

```bash
# Vào thư mục project
cd "c:\E-commerce Website UI Design (1)"

# Chạy script reset
python reset_database.py

# Nhập 'yes' khi được hỏi
```

**Điều này sẽ:**

- ✅ Xóa file ecommerce.db cũ
- ✅ Tạo lại schema mới với shipper support
- ✅ Tạo các table mới

### Bước 2: Khởi Động Backend

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Kiểm tra: `http://localhost:8000/health` phải trả về `{"status": "healthy"}`

### Bước 3: Khởi Động Frontend

```bash
npm run dev
# hoặc
yarn dev
```

## 👥 Tạo Tài Khoản Shipper

### Cách 1: Qua Admin Dashboard (Dễ Nhất)

1. Đăng nhập admin: `http://localhost:5173/login`
   - Username: `admin` (hoặc user admin khác)
   - Password: `password` (hoặc mật khẩu admin)

2. Vào `/admin/users`

3. Click nút "Tạo Tài Khoản"

4. Điền form:
   - **Tên Người Dùng:** shipper1
   - **Email:** shipper1@example.com
   - **Mật Khẩu:** password123
   - **Role:** Shipper (chọn từ dropdown)

5. Click "Tạo"

### Cách 2: Qua API (Advanced)

```bash
curl -X POST http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shipper2",
    "email": "shipper2@example.com",
    "password": "password123",
    "role": "shipper"
  }'
```

## 📱 Sử Dụng Shipper Dashboard

### Đăng Nhập Shipper

```
URL: http://localhost:5173/login
Username: shipper1
Password: password123
```

Sau khi đăng nhập, sẽ tự động redirect đến `/shipper` (Shipper Dashboard)

### Giao Diện Shipper Dashboard

**Phần Thống Kê:**

- Tổng Đơn Hàng (tất cả đơn được giao)
- Đã Giao (số đơn hoàn tất)
- Đang Xử Lý (chờ cập nhật)
- Đã Hủy (đơn bị hủy)

**Danh Sách Đơn Hàng:**

- Hiển thị đơn hàng được gán cho shipper
- Mỗi đơn hàng hiển thị:
  - ID đơn (8 ký tự đầu)
  - Trạng thái (badge màu)
  - Tổng tiền
  - Ngày tạo

### Xem Chi Tiết & Cập Nhật

**Click vào đơn hàng để mở rộng:**

**Thông Tin Người Nhận:**

- ✓ Tên đầy đủ
- ✓ Số điện thoại (clickable để gọi)
- ✓ Địa chỉ giao hàng

**Danh Sách Sản Phẩm:**

- Tên sản phẩm
- Số lượng
- Giá lẻ + tổng tiền sản phẩm

**Phương Thức Thanh Toán:**

- QR/Chuyển Khoản
- Trả Tiền Khi Nhận (COD)
- Stripe/Card

**Cập Nhật Trạng Thái:**

- Nút "✓ Đã Giao" (xanh) → Giao hàng thành công
- Nút "✗ Hủy" (đỏ) → Hủy đơn hàng

⚠️ **Chú ý:** Nếu đơn hàng đã "Đã Giao" hoặc "Hủy" rồi, không thể cập nhật nữa

## 🎛️ Admin Gán Shipper Cho Đơn Hàng

### Cách 1: Qua Admin Dashboard

1. Đăng nhập Admin: `/admin`

2. Vào "Quản Lý Đơn Hàng"

3. Chọn một đơn hàng

4. Click nút "Gán Shipper" (hoặc tương tự)

5. Chọn shipper từ dropdown

6. Click "Xác Nhận"

### Cách 2: Qua API

```bash
# Trước tiên, lấy danh sách shippers
curl -X GET http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json"

# Tìm user có role="shipper", lấy ID của họ

# Gán shipper cho đơn hàng
curl -X POST http://localhost:8000/api/admin/orders/{order_id}/assign-shipper \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shipper_id": "shipper-user-id"
  }'
```

**Response:**

```json
{
  "id": "order-id-12345",
  "shipper_id": "shipper-user-id",
  "shipper_name": "shipper1",
  "message": "Shipper assigned successfully"
}
```

## 🔌 API Endpoints

### Shipper Endpoints

(Require: `Authorization: Bearer {shipper_token}`)

#### `GET /api/shipper/orders`

Lấy danh sách đơn hàng của shipper

```json
Response:
[
  {
    "id": "order-uuid",
    "status": "paid",
    "total": 2999900,
    "paymentMethod": "cod",
    "shippingInfo": {
      "fullName": "Nguyễn Văn A",
      "phone": "0987654321",
      "address": "123 Nguyễn Hue, TP.HCM"
    },
    "items": [
      {
        "productId": 1,
        "name": "Lò Nướng 3000W",
        "quantity": 2,
        "price": 1499950
      }
    ],
    "createdAt": "2026-05-22T14:49:11.381257",
    "updatedAt": "2026-05-22T14:49:11.381259"
  }
]
```

#### `GET /api/shipper/{order_id}`

Lấy chi tiết một đơn hàng

#### `PATCH /api/shipper/{order_id}/status`

Cập nhật trạng thái đơn hàng

```json
Request:
{
  "status": "delivered"  // or "cancelled"
}

Response:
{
  "orderId": "order-uuid",
  "previousStatus": "paid",
  "newStatus": "delivered",
  "message": "Order status updated from paid to delivered"
}
```

### Admin Endpoints

(Require: `Authorization: Bearer {admin_token}`)

#### `POST /api/admin/orders/{order_id}/assign-shipper`

Gán shipper cho đơn hàng

```json
Request:
{
  "shipper_id": "user-uuid"
}

Response:
{
  "id": "order-uuid",
  "shipper_id": "user-uuid",
  "shipper_name": "shipper1",
  "message": "Shipper assigned successfully"
}
```

#### `POST /api/admin/users`

Tạo tài khoản (bao gồm shipper)

```json
Request:
{
  "username": "shipper_name",
  "email": "shipper@example.com",
  "password": "secure_password",
  "role": "shipper"  // or "user", "admin"
}
```

## 🔐 Authentication

### Admin Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'

# Response:
# {
#   "id": "admin-uuid",
#   "username": "admin",
#   "email": "admin@example.com",
#   "role": "admin",
#   "access_token": "eyJ..."
# }
```

### Shipper Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shipper1",
    "password": "password123"
  }'

# Response:
# {
#   "id": "shipper-uuid",
#   "username": "shipper1",
#   "email": "shipper1@example.com",
#   "role": "shipper",
#   "access_token": "eyJ..."
# }
```

## 🗄️ Cấu Trúc Database

### User Table

```sql
id (UUID, PK)
username (String, Unique)
email (String, Unique)
hashed_password (String)
role (String) -- 'user', 'admin', 'shipper'
created_at (DateTime)
updated_at (DateTime)
```

### Order Table

```sql
id (UUID, PK)
user_id (UUID, FK, Nullable) -- Customer who placed order (null for guest)
shipper_id (UUID, FK, Nullable) -- NEW: Shipper assigned to this order
status (String) -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
total (Float)
payment_method (String)
shipping_info (JSON) -- Contains fullName, phone, address
shipper (String) -- Shipper name for reference
shipper_phone (String, Nullable)
created_at (DateTime)
updated_at (DateTime)
```

### Relationships

- `User.orders` (1-to-Many) ← User placed orders
- `User.shipped_orders` (1-to-Many) ← User is shipper for orders

## 📝 Files Được Thay Đổi

### Backend

- ✅ `backend/models/orm.py` - Thêm shipper_id, shipped_orders relationship
- ✅ `backend/api/shipper.py` - NEW, Shipper-specific endpoints
- ✅ `backend/api/admin.py` - Thêm assign_shipper_to_order endpoint
- ✅ `backend/main.py` - Register shipper router
- ✅ `backend/db.py` - Thêm reset_db() function

### Frontend

- ✅ `src/app/pages/ShipperDashboard.tsx` - NEW, Shipper dashboard page
- ✅ `src/app/routes.tsx` - Thêm /shipper route
- ✅ `src/app/pages/LoginPage.tsx` - Handle shipper redirect
- ✅ `src/utils/apiClient.ts` - Improved error handling

### Utilities

- ✅ `reset_database.py` - Updated to delete SQLite file properly

## 🧪 Test Scenarios

### Scenario 1: Tạo Shipper và Gán Đơn Hàng

```
1. Admin tạo user shipper1 (role="shipper")
2. Customer đặt hàng
3. Admin gán order cho shipper1
4. Shipper1 đăng nhập
5. Shipper1 xem đơn hàng, click mở rộng
6. Shipper1 xem chi tiết người nhận
7. Shipper1 click "Đã Giao" để hoàn tất
8. Trạng thái cập nhật thành "delivered"
```

### Scenario 2: Guest Checkout (Không Đổi)

```
1. Guest thêm sản phẩm vào giỏ
2. Guest thanh toán (không cần tài khoản)
3. Admin gán shipper (user_id=null là ok)
4. Shipper hoạt động bình thường
5. Guest không thể xem lịch sử (vì guest)
```

### Scenario 3: Customer Checkout (Vẫn Hoạt Động)

```
1. User đăng nhập
2. User thêm sản phẩm và thanh toán
3. User vào /orders xem lịch sử
4. Admin gán shipper cho order
5. Shipper hoạt động bình thường
6. Nếu bạn thêm cập nhật status trong OrderHistory, user sẽ thấy
```

## ⚠️ Lưu Ý Quan Trọng

1. **Shipper chỉ thấy đơn hàng được gán cho họ** - Order phải có `shipper_id = shipper_user_id`

2. **Không thể cập nhật status của đơn "delivered" hoặc "cancelled"** - Logic này trong backend

3. **Guest orders có user_id=null nhưng vẫn có thể được gán shipper** - Hoàn toàn bình thường

4. **Admin cần tạo user shipper trước khi gán** - Không thể gán user không tồn tại

5. **Token shipper chỉ có quyền xem order của họ** - Backend kiểm tra `shipper_id == user_id`

## 🐛 Troubleshooting

| Lỗi                           | Nguyên Nhân                           | Giải Pháp                                                    |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| Shipper không thấy đơn        | Order chưa được gán                   | Admin gán order → POST /api/admin/orders/{id}/assign-shipper |
| "Only shipper can access"     | User không phải shipper               | Tạo user với role="shipper"                                  |
| Cannot UPDATE order status    | Order đã "delivered" hoặc "cancelled" | Chỉ cập nhật được từ "pending", "paid", "shipped"            |
| Login không redirect /shipper | Role không load                       | Clear localStorage, đăng nhập lại                            |
| Database error sau reset      | Reset không xóa hết file              | Xóa ecommerce.db\*, chạy reset lại                           |

## ✅ Checklist

- [ ] Reset database (`python reset_database.py`)
- [ ] Backend chạy ok (`http://localhost:8000/health`)
- [ ] Frontend chạy ok (`http://localhost:5173`)
- [ ] Tạo user shipper
- [ ] Tạo đơn hàng (qua frontend)
- [ ] Admin gán shipper cho đơn
- [ ] Shipper đăng nhập
- [ ] Shipper xem đơn hàng
- [ ] Shipper cập nhật status
- [ ] Xác nhận status thay đổi

---

## 📞 Hỗ Trợ

- Check backend logs: Terminal chạy uvicorn
- Check frontend logs: Browser console (F12)
- API test: Postman hoặc curl
- Database: `ecommerce.db` (SQLite)

Chúc bạn sử dụng thành công! 🚀
