## 🔍 **HƯỚNG DẪN DEBUG - Kiểm Tra localStorage**

### **1. Mở DevTools**

- Nhấn `F12` hoặc `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)
- Hoặc: Chuột phải → "Inspect" → "DevTools"

### **2. Đi tới Tab "Application"**

1. Trong DevTools, chọn tab **Application** (hoặc **Storage** trên Firefox)
2. Ở thanh bên trái, tìm **Local Storage**
3. Click vào tên domain của website (ví dụ: `http://localhost:5173`)

### **3. Xem Dữ Liệu Đã Lưu**

Bạn sẽ thấy các cặp key-value như:

| Key                | Value                                        | Mô Tả                        |
| ------------------ | -------------------------------------------- | ---------------------------- |
| `user`             | `{"id":"user-1234","username":"john",...}`   | User hiện tại đang đăng nhập |
| `users`            | `[{"id":"user-1234","username":"john",...}]` | Danh sách tất cả users       |
| `cart-user-1234`   | `[{"id":1,"name":"Lò Nướng",...}]`           | Giỏ hàng của user            |
| `orders-user-1234` | `[{"id":"order-1234","items":[...],...}]`    | Lịch sử đơn hàng             |

### **4. Kiểm Tra Chi Tiết**

**🟢 Khi thêm sản phẩm vào giỏ:**

- Key `cart-{userId}` sẽ xuất hiện
- Giá trị sẽ tăng số lượng items

**🔵 Khi đặt đơn hàng:**

- Key `orders-{userId}` sẽ xuất hiện
- Giỏ hàng sẽ được xóa

**🔴 Khi logout:**

- Key `user` sẽ bị xóa
- Các `cart-*` và `orders-*` vẫn còn (dành cho lần đăng nhập sau)

### **5. Debug Console**

Bạn có thể chạy lệnh trong **Console tab** để kiểm tra:

```javascript
// Xem TẤT CẢ dữ liệu trong localStorage
console.log(JSON.parse(localStorage.getItem("user")));

// Xem giỏ hàng
console.log(JSON.parse(localStorage.getItem("cart-user-1234")));

// Xem tất cả orders
console.log(JSON.parse(localStorage.getItem("orders-user-1234")));

// Xem tất cả keys (dùng hàm từ storageManager)
// Trước tiên import: import { StorageHelper } from './utils/storageManager';
// Sau đó: console.log(StorageHelper.getAllData());
```

### **6. Xóa Dữ Liệu (Reset)**

**Cách 1: Qua DevTools**

- Right-click trên key muốn xóa
- Chọn "Delete"

**Cách 2: Qua Console**

```javascript
// Xóa toàn bộ localStorage
localStorage.clear();

// Hoặc xóa một key cụ thể
localStorage.removeItem("user");
localStorage.removeItem("cart-user-1234");
```

### **7. Kiểm Tra Hydration (Tải Lại Dữ Liệu)**

**✅ Đúng:** Tải lại trang (`Ctrl + R` / `Cmd + R`) → Dữ liệu vẫn hiện → localStorage hoạt động

**❌ Sai:** Tải lại trang → Mất dữ liệu → Có lỗi gì đó

### **8. Kiểm Tra Console Logs**

Mình đã thêm console logs để debug. Mở **Console tab** xem:

```
[Storage] Current user saved: john
[Storage] Cart for user user-1234 saved: 3 items
[Storage] Orders for user user-1234 saved: 1 orders
```

---

## 📋 **Checklist Kiểm Tra**

- [ ] Tạo tài khoản mới → Xem `users` key có thêm user không?
- [ ] Đăng nhập → `user` key có xuất hiện không?
- [ ] Thêm sản phẩm vào giỏ → `cart-{id}` key có xuất hiện không?
- [ ] Tăng số lượng sản phẩm → Value của `cart-{id}` có cập nhật không?
- [ ] Đặt đơn hàng → `orders-{id}` key có xuất hiện không?
- [ ] Tải lại trang → Dữ liệu có vẫn còn không?
- [ ] Logout → `user` key có bị xóa không? (`cart-*` vẫn còn không?)
- [ ] Đăng nhập lại → `user` key có xuất hiện không? `cart-*` có khôi phục không?
