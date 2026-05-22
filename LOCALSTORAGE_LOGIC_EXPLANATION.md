## 📖 **GIẢI THÍCH LOGIC CỦA LOCAL PERSISTENCE**

---

## **1. TẠI SAO DÙNG LOCAL PERSISTENCE?**

### Vấn đề cũ (Không có localStorage):

```javascript
const [cart, setCart] = useState([]); // Mỗi khi F5, giỏ hàng trở thành []
```

- 👎 User thêm sản phẩm → F5 lại trang → **Tất cả bị mất**
- 👎 Người dùng sẽ **quay lưng** (người ta nghĩ website bị lỗi)

### Giải pháp mới (Với localStorage):

```javascript
const [cart, setCart] = useState([]); // State

useEffect(() => {
  const saved = localStorage.getItem(`cart-${userId}`);
  if (saved) setCart(JSON.parse(saved)); // Khôi phục từ storage
}, [userId]);

useEffect(() => {
  localStorage.setItem(`cart-${userId}`, JSON.stringify(cart)); // Tự động lưu
}, [cart, userId]);
```

- ✅ User thêm sản phẩm → F5 lại trang → **Dữ liệu vẫn còn**
- ✅ Tốt cho UX (User Experience)

---

## **2. CỘT TRÚC CỦA STORAGE MANAGER**

### File: `src/utils/storageManager.ts`

**Tại sao cần này?**

- ✅ **Centralized:** Tất cả logic localStorage nằm ở một chỗ
- ✅ **Reusable:** Dùng lại trong nhiều places (context, pages)
- ✅ **Maintainable:** Nếu thay đổi logic, chỉ sửa 1 file
- ✅ **Debuggable:** Console logs giúp theo dõi

### Cấu trúc:

```
storageManager.ts
├── UserStorage          // Quản lý user
│   ├── saveCurrentUser
│   ├── loadCurrentUser
│   ├── removeCurrentUser
│   ├── saveUsersList
│   └── loadUsersList
├── CartStorage          // Quản lý giỏ hàng
│   ├── saveCart
│   ├── loadCart
│   └── removeCart
├── OrdersStorage        // Quản lý đơn hàng
│   ├── saveOrders
│   ├── loadOrders
│   └── removeOrders
└── StorageHelper        // Helper utilities
    ├── getAllData       // Xem tất cả
    ├── clearAll         // Xóa tất cả
    └── clearUserData    // Xóa 1 user
```

---

## **3. FLOW: "HYDRATION" (Tải Lại Dữ Liệu)**

### Khi app khởi động:

```
1. User mở website
   ↓
2. App render → AuthContext khởi tạo
   ↓
3. useEffect chạy:
   const savedUser = UserStorage.loadCurrentUser(); ✅ Đọc từ localStorage

4. Nếu có saved user:
   → setUser(savedUser) → State update
   → Render lại với user data

5. Nếu chưa có (first time):
   → setUser(null) → Không lỗi (graceful)
   → Render login page
```

### Code thực tế:

```typescript
// src/app/context/AuthContext.tsx
useEffect(() => {
  const savedUser = UserStorage.loadCurrentUser(); // ✅ Load
  setUser(savedUser); // Có hoặc null
  setIsLoading(false); // ✅ Báo xong load
}, []); // Chỉ chạy 1 lần khi mount
```

**Lợi ích:**

- ✅ Dữ liệu không bị mất khi refresh
- ✅ User không cần login lại khi F5
- ✅ Không lỗi nếu localStorage trống (first-time users)

---

## **4. FLOW: "PERSIST" (Lưu Dữ Liệu)**

### Khi user action:

```
User thêm sản phẩm → addToCart() chạy
   ↓
setCart([...cart, newItem]) → State update
   ↓
useEffect phát hiện cart thay đổi
   ↓
CartStorage.saveCart(userId, cart) ✅ Lưu vào localStorage
   ↓
localStorage.setItem(`cart-${userId}`, JSON.stringify(cart))
   ↓
Hoàn tất ✅
```

### Code thực tế:

```typescript
// src/app/context/CartContext.tsx
useEffect(() => {
  if (user) {
    CartStorage.saveCart(user.id, cart); // ✅ Tự động lưu
  }
}, [cart, user]); // Chạy mỗi khi cart hoặc user thay đổi
```

**Tại sao dùng dependency array `[cart, user]`?**

- `cart`: Lưu mỗi khi giỏ hàng thay đổi
- `user`: Lưu mỗi khi user đổi (logout/login)

---

## **5. FLOW: "CLEAR" (Xóa Dữ Liệu)**

### Khi user logout:

```
User click Logout → logout() chạy
   ↓
clearCart() được gọi
   ↓
CartStorage.removeCart(userId) ✅ Xóa localStorage
   ↓
setUser(null) → State update
   ↓
UserStorage.removeCurrentUser() ✅ Xóa user khỏi localStorage
   ↓
Redirect → Login page
```

### Code thực tế:

```typescript
// src/app/context/AuthContext.tsx
const logout = () => {
  if (user) {
    StorageHelper.clearUserData(user.id); // ✅ Xóa cart + orders
  }
  setUser(null);
  UserStorage.removeCurrentUser(); // ✅ Xóa user
};
```

**Tại sao xóa cart khi logout?**

- ✅ Bảo vệ privacy (user khác không thấy giỏ hàng cũ)
- ✅ Dành chỗ lưu trữ

---

## **6. FLOW: "PLACE ORDER" (Đặt Hàng)**

### Khi user checkout:

```
1. User nhập địa chỉ, chọn thanh toán → handlePlaceOrder()
   ↓
2. Validate dữ liệu
   ↓
3. Tạo order object:
   const newOrder = {
     id: `order-${Date.now()}`,
     items: cart,
     total: cartTotal,
     ...
   }
   ↓
4. OrdersStorage.loadOrders(userId) ✅ Lấy orders cũ
   ↓
5. orders.push(newOrder) ✅ Thêm order mới
   ↓
6. OrdersStorage.saveOrders(userId, orders) ✅ Lưu lại
   ↓
7. clearCart() ✅ Xóa giỏ hàng
   ↓
8. Redirect → /order-success
```

### Code thực tế:

```typescript
// src/app/pages/CheckoutPage.tsx
const handlePlaceOrder = () => {
  if (!validateShipping()) return;

  const orders = OrdersStorage.loadOrders(user?.id || ''); // ✅ Load cũ
  const newOrder = { ... };
  orders.push(newOrder); // ✅ Thêm vào
  OrdersStorage.saveOrders(user?.id || '', orders); // ✅ Lưu

  clearCart();
  navigate('/order-success');
};
```

**Tại sao load orders cũ rồi push mới?**

- ✅ Bảo vệ orders cũ (không bị ghi đè)
- ✅ Giữ lịch sử đầy đủ

---

## **7. ERROR HANDLING (Xử Lý Lỗi)**

### Nếu localStorage corrupt:

```javascript
// storageManager.ts
const loadCurrentUser = () => {
  try {
    const saved = localStorage.getItem("user");
    if (saved) {
      return JSON.parse(saved); // ✅ Parse OK
    }
    return null;
  } catch (error) {
    console.error("Failed to parse user:", error);
    localStorage.removeItem("user"); // ✅ Xóa dữ liệu bị hỏng
    return null; // ✅ Graceful fallback
  }
};
```

**Điều gì xảy ra?**

1. Nếu JSON.parse fail (corrupted data)
2. Catch error → Log ra console
3. Xóa dữ liệu bị hỏng
4. Return null → App tiếp tục, user thấy login page
5. Không bị crash ✅

---

## **8. LOCALSTORAGE LIMITS**

### Kích thước:

- **~5-10 MB** trên hầu hết browsers
- Bạn lưu JSON strings, nên ~2-3 MB dữ liệu thực tế

### Dữ liệu bạn lưu (hiện tại):

- `user`: ~200 bytes
- `users`: ~500 bytes x số tài khoản
- `cart-*`: ~500 bytes x số users
- `orders-*`: ~2 KB x số orders x số users

**Kết luận:** Với e-commerce nhỏ, không vấn đề gì 👌

---

## **9. CÁC BEST PRACTICES ĐÃ ÁP DỤNG**

✅ **Separation of Concerns** - localStorage logic riêng trong `storageManager.ts`
✅ **DRY (Don't Repeat Yourself)** - Dùng lại hàm utilities
✅ **Error Handling** - Try-catch + graceful fallback
✅ **Console Logging** - Debug dễ dàng
✅ **User-scoped Storage** - `cart-${userId}`, `orders-${userId}`
✅ **Hydration Pattern** - Load từ storage lúc startup
✅ **Persistence Pattern** - Auto-save mỗi khi state thay đổi

---

## **10. TROUBLESHOOTING**

| Vấn đề                        | Nguyên nhân          | Giải pháp                        |
| ----------------------------- | -------------------- | -------------------------------- |
| Dữ liệu không lưu             | useEffect không chạy | Kiểm tra dependencies array      |
| Dữ liệu bị xóa                | clearCart() được gọi | Thêm confirm dialog              |
| Storage.getItem() return null | User không login     | Check `if (user)` trước khi load |
| JSON.parse error              | Dữ liệu corrupt      | Thêm try-catch (đã có)           |
| Giỏ hàng trống khi F5         | Hydration chưa xong  | Check `isLoading` state          |

---

## **11. FUTURE IMPROVEMENTS**

Nếu muốn nâng cấp:

1. **Dùng IndexedDB** thay localStorage (lưu được hình ảnh, files)
2. **Sync với Backend** (cloud backup)
3. **Encryption** cho sensitive data
4. **Expiration** - Xóa dữ liệu cũ hơn 30 ngày
