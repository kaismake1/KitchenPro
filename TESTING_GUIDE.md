## 🧪 **TESTING GUIDE - Kiểm Tra Local Persistence**

---

## **TEST 1: Register & Login Persistence**

### Bước 1-5: Register tài khoản mới

1. Mở website
2. Chọn "Register" (hoặc "Đăng Ký")
3. Nhập:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Register"
5. **Kết quả mong đợi:** Redirect sang HomePage, user được login

### Bước 6: Kiểm tra localStorage

1. Mở DevTools → Tab "Application"
2. Click "Local Storage" → Select domain
3. **✅ Kiểm tra:** Key `user` xuất hiện với dữ liệu:
   ```json
   {
     "id": "user-1234567890",
     "username": "testuser",
     "email": "test@example.com",
     "role": "user"
   }
   ```

### Bước 7: F5 tải lại trang

1. Nhấn `F5` hoặc `Ctrl+R`
2. **✅ Kết quả:** User vẫn login, không cần enter lại credentials
3. **✅ Trong DevTools:** Key `user` vẫn còn, giá trị không thay đổi

---

## **TEST 2: Cart Persistence**

### Bước 1-3: Thêm sản phẩm vào giỏ

1. Trong HomePage, tìm bất kỳ sản phẩm nào
2. Click "Thêm vào giỏ" (Add to Cart)
3. Lặp lại với 2-3 sản phẩm khác

### Bước 4: Kiểm tra localStorage

1. Mở DevTools → "Application" → "Local Storage"
2. **✅ Kiểm tra:** Key `cart-user-{userId}` xuất hiện với dữ liệu:
   ```json
   [
     {
       "id": 1,
       "name": "Lò Nướng Điện",
       "price": 29999900,
       "image": "...",
       "quantity": 1,
       "category": "Lò Nướng"
     },
     ...
   ]
   ```

### Bước 5: Thay đổi số lượng

1. Trong giỏ hàng (Cart), tăng/giảm số lượng 1 sản phẩm
2. **✅ Trong DevTools:** Value của `cart-{userId}` cập nhật (quantity thay đổi)
3. Nhấn `F5` → **✅ Giỏ hàng vẫn giữ nguyên số lượng mới**

### Bước 6: Remove sản phẩm

1. Xóa 1 sản phẩm khỏi giỏ
2. **✅ Trong DevTools:** `cart-{userId}` update (array có 1 item ít hơn)
3. Nhấn `F5` → **✅ Sản phẩm vẫn bị xóa**

### Bước 7: Clear giỏ hàng

1. Click "Clear Cart" (nếu có nút)
2. **✅ Trong DevTools:** Key `cart-{userId}` vẫn tồn tại nhưng array rỗng `[]`
3. Nhấn `F5` → **✅ Giỏ hàng vẫn rỗng**

---

## **TEST 3: Order Persistence**

### Bước 1-3: Thêm sản phẩm & Checkout

1. Thêm 2-3 sản phẩm vào giỏ
2. Click "Go to Checkout"
3. Nhập shipping info:
   - Full Name: `Nguyễn Văn A`
   - Phone: `0901234567`
   - Address: `123 Đường ABC, TP HCM`

### Bước 4: Chọn payment method

1. Chọn "QR Code" hoặc "COD"
2. Click "Place Order"
3. **✅ Kết quả:** Redirect sang "Order Success" page

### Bước 5: Kiểm tra localStorage

1. Mở DevTools → "Application" → "Local Storage"
2. **✅ Kiểm tra:** Key `orders-user-{userId}` xuất hiện với dữ liệu:
   ```json
   [
     {
       "id": "order-1234567890",
       "items": [...],
       "total": 59999800,
       "paymentMethod": "qr",
       "shippingInfo": {...},
       "shipper": "John Express Delivery",
       "date": "2026-05-14T...",
       "status": "pending"
     }
   ]
   ```

### Bước 6: Kiểm tra giỏ hàng đã xóa

1. **✅ Trong DevTools:** Key `cart-{userId}` = `[]` (được clear)
2. Go to "View Cart" → **✅ Giỏ hàng trống**

### Bước 7: Xem Order History

1. Click "Order History" (hoặc profile menu)
2. **✅ Kết quả:** Hiển thị order vừa tạo
3. Nhấn `F5` → **✅ Order vẫn còn**

### Bước 8: Đặt order thứ 2

1. Thêm sản phẩm khác vào giỏ → Checkout → Place Order
2. **✅ Trong DevTools:** `orders-{userId}` array có 2 items
3. View Order History → **✅ Cả 2 orders đều hiển thị**

---

## **TEST 4: Logout & Relogin**

### Bước 1: Logout

1. Click "Logout" (từ header/menu)
2. **✅ Kết quả:** Redirect sang LoginPage
3. **✅ Trong DevTools:** Key `user` bị xóa

### Bước 2: Kiểm tra dữ liệu khác

1. **✅ Trong DevTools:**
   - `users` vẫn còn (danh sách accounts)
   - `cart-{userId}` vẫn còn (giỏ hàng của user cũ)
   - `orders-{userId}` vẫn còn (lịch sử của user cũ)

### Bước 3: Login lại với tài khoản khác

1. Nhập username: `admin` , password: `123`
2. Click "Login"
3. **✅ Kết quả:** Login thành công (admin account)
4. **✅ Trong DevTools:**
   - `user` được update (admin-1)
   - `cart-admin-1` là rỗng (admin chưa có giỏ hàng)
   - `orders-admin-1` là rỗng (admin chưa có orders)

### Bước 4: Đặt hàng với admin

1. Thêm sản phẩm → Checkout → Place Order
2. **✅ Trong DevTools:** `orders-admin-1` xuất hiện (1 order)
3. View Order History → **✅ Chỉ thấy admin orders, không thấy testuser orders**

### Bước 5: Logout rồi Login lại testuser

1. Logout
2. Login với `testuser`
3. **✅ Kết quả:**
   - `user` = testuser
   - `cart-user-{id}` = [khôi phục giỏ hàng cũ]
   - `orders-user-{id}` = [2 orders từ trước]
4. **✅ Order History:** Chỉ thấy testuser orders

---

## **TEST 5: Multi-Tab Persistence**

### Bước 1-2: Mở 2 tabs cùng domain

1. Mở website ở tab 1
2. Login với user
3. Thêm sản phẩm vào giỏ ở tab 1

### Bước 3: Chuyển sang tab 2

1. Mở website ở tab 2 (cùng domain)
2. **✅ Kết quả:** Auto-login (không cần enter credentials)
3. **✅ Kết quả:** Giỏ hàng cũng sync (hiển thị sản phẩm từ tab 1)

### Bước 4: Thêm sản phẩm ở tab 2

1. Thêm sản phẩm mới ở tab 2
2. Quay lại tab 1
3. **✅ Kết quả:** Giỏ hàng auto-update (thấy sản phẩm mới)

**Ghi chú:** localStorage được share giữa tất cả tabs của cùng domain

---

## **TEST 6: Console Logs**

### Bước 1: Mở Console

1. DevTools → Tab "Console"
2. **✅ Xem logs:**
   ```
   [Storage] Current user saved: testuser
   [Storage] Cart for user user-123 saved: 3 items
   [Storage] Orders for user user-123 saved: 1 orders
   ```

### Bước 2: Run custom commands

```javascript
// Xem user hiện tại
JSON.parse(localStorage.getItem("user"));

// Xem danh sách users
JSON.parse(localStorage.getItem("users"));

// Xem giỏ hàng
JSON.parse(localStorage.getItem("cart-user-123"));

// Xem orders
JSON.parse(localStorage.getItem("orders-user-123"));

// Xem TẤT CẢ localStorage
Object.keys(localStorage);
```

---

## **TEST 7: Browser Quit & Reopen**

### Bước 1: Login & Add items

1. Login
2. Thêm sản phẩm vào giỏ
3. Note lại số lượng & sản phẩm

### Bước 2: Completely quit browser

1. **Đóng TOÀN BỘ trình duyệt** (Firefox/Chrome/Edge)
2. Chất không phải tabs

### Bước 3: Reopen browser

1. Mở lại trình duyệt
2. Trỏ tới website
3. **✅ Kết quả:**
   - Auto-login (user vẫn lưu)
   - Giỏ hàng vẫn còn (cart items vẫn đó)
   - Order history vẫn còn

---

## **TEST 8: Cache Clear Scenarios**

### Scenario A: Clear cache nhưng giữ localStorage

1. DevTools → Settings → "Network" → Uncheck "Disable cache"
2. Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
3. **✅ Kết quả:** Dữ liệu vẫn còn

### Scenario B: Clear localStorage manually

1. DevTools → Application → Right-click domain → "Clear site data"
2. **✅ Kết quả:** Tất cả dữ liệu xóa, giống first-time user

### Scenario C: Clear một user

```javascript
// Xóa tất cả data của user hiện tại
const userId = JSON.parse(localStorage.getItem("user")).id;
localStorage.removeItem(`cart-${userId}`);
localStorage.removeItem(`orders-${userId}`);
```

3. **✅ Kết quả:** Giỏ hàng & orders xóa, nhưng user vẫn login

---

## **✅ FINAL CHECKLIST**

- [ ] ✅ Register & login lưu user
- [ ] ✅ F5 không cần login lại
- [ ] ✅ Thêm sản phẩm → Key `cart-*` xuất hiện
- [ ] ✅ Tăng số lượng → Cart value cập nhật
- [ ] ✅ F5 giỏ hàng không mất
- [ ] ✅ Checkout → Key `orders-*` xuất hiện
- [ ] ✅ Giỏ hàng được clear sau checkout
- [ ] ✅ Order History hiển thị đúng
- [ ] ✅ Logout xóa user key
- [ ] ✅ Cart & orders vẫn lưu cho lần đăng nhập sau
- [ ] ✅ Đăng nhập user khác, dữ liệu không leak
- [ ] ✅ 2 tabs sync dữ liệu
- [ ] ✅ Đóng browser & reopen vẫn có dữ liệu
- [ ] ✅ Console logs hiển thị đúng

---

## **❌ TROUBLESHOOTING - Nếu Test Fail**

| Test Fail         | Nguyên nhân             | Fix                                                              |
| ----------------- | ----------------------- | ---------------------------------------------------------------- |
| Dữ liệu không lưu | Import sai path         | Check `import { CartStorage } from '../../utils/storageManager'` |
| F5 dữ liệu mất    | useEffect không chạy    | Thêm dependencies: `[cart, user]`                                |
| JSON.parse error  | localStorage corrupt    | Clear cache: DevTools → Clear site data                          |
| Login không auto  | User null               | Check AuthContext hydration                                      |
| Cart không sync   | User thay đổi           | Dependency array phải có `user`                                  |
| Order không lưu   | CheckoutPage import sai | Check OrdersStorage import                                       |

---

## **💡 TIPS**

1. **Mở DevTools ngang hàng:** DevTools ở bên phải giúp thấy changes real-time
2. **Dùng Filters:** localStorage filter rất hữu ích
3. **JSON format:** Nếu value quá dài, click value → Pretty print
4. **Clear thường xuyên:** Khi testing, clear old data tránh confuse
5. **Multiple users:** Test với 2-3 accounts khác nhau để verify isolation
