# Backend-First Architecture Refactoring

## Overview

Your React SPA has been completely refactored to use **FastAPI backend with SQLite database** instead of relying on client-side `localStorage`. This document explains the new architecture, data flows, and best practices.

---

## Architecture Changes

### Before (localStorage-based)

```
React App → localStorage → Browser (isolated per environment)
            ↓ (manual on checkout)
         Backend API → Database
```

### After (backend-first)

```
React App → API Client → FastAPI Backend → SQLite Database
(in-memory/state only)  (persistent)
```

---

## New API Client (`src/utils/apiClient.ts`)

### Purpose

Centralized HTTP client for all backend communication with automatic token management.

### Features

- **Automatic token injection**: Reads token from localStorage and includes in `Authorization: Bearer {token}` header
- **Consistent error handling**: Parses JSON errors and returns standardized `ApiError` interface
- **HTTP methods**: `get()`, `post()`, `patch()`, `delete()`
- **No duplication**: Single source of truth for API logic

### Usage Examples

```typescript
import { apiClient } from "../../utils/apiClient";

// GET request (automatic token injection)
const user = await apiClient.get("/auth/me");

// POST with body (automatic token injection)
const response = await apiClient.post("/checkout/", {
  cart: items,
  shippingInfo: {
    /* ... */
  },
  paymentMethod: "qr",
});

// Error handling
try {
  await apiClient.post("/auth/login", { username, password });
} catch (error: any) {
  console.log(error.status); // HTTP status code
  console.log(error.message); // Error message
  console.log(error.details); // Full response body
}
```

---

## Refactored Contexts

### 1. AuthContext (`src/app/context/AuthContext.tsx`)

#### Changes

- ✅ Now uses `apiClient` instead of raw `fetch()`
- ✅ Token validation happens on app startup (hydration from localStorage)
- ✅ Token stored ONLY for session hydration, NOT user data
- ✅ User data fetched from `/auth/me` endpoint on every load

#### Data Flow

**Login:**

```
User submits form
    ↓
apiClient.post("/auth/login", { username, password })
    ↓
Backend validates credentials
    ↓
Backend returns { id, username, email, role, access_token }
    ↓
React saves token to localStorage (TokenManager)
    ↓
React stores user object in state (NOT localStorage)
    ↓
User redirected to /checkout or dashboard
```

**Registration:**

```
User submits form
    ↓
apiClient.post("/auth/register", { username, email, password })
    ↓
Backend creates user, returns { id, username, email, role, access_token }
    ↓
Token saved, user stored in state, auto-logged in
```

**Page Refresh (Hydration):**

```
App loads
    ↓
AuthContext useEffect runs
    ↓
TokenManager.getToken() reads from localStorage
    ↓
apiClient.get("/auth/me") with token in header
    ↓
Backend validates token and returns user object
    ↓
If valid: State updated with user data
    ↓
If invalid: Token cleared, user redirected to /login
```

#### Key Code

```typescript
const login = async (username: string, password: string) => {
  const data = await apiClient.post("/auth/login", { username, password });

  TokenManager.setToken(data.access_token);
  setAccessToken(data.access_token);
  setUser({
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role,
  });
  return true;
};
```

---

### 2. CartContext (`src/app/context/CartContext.tsx`)

#### Changes (MAJOR)

- ❌ **REMOVED**: All `localStorage` calls via `CartStorage` utility
- ❌ **REMOVED**: `useEffect` that hydrates cart from storage
- ❌ **REMOVED**: `useEffect` that persists cart to storage
- ✅ **NEW**: Cart stored IN-MEMORY only during user session
- ✅ **NEW**: Cart persisted to backend ONLY on checkout (via POST to `/checkout/`)
- ✅ **NEW**: Cart is reset when user logs out

#### Why In-Memory Only?

1. **Session State**: Cart is temporary shopping context, not permanent data
2. **Freshness**: Prices, stock, availability can change → Always send current cart to backend
3. **Performance**: No localStorage bloat
4. **UX**: Users expect cart to be cleared after checkout (not persisted)
5. **Data Integrity**: Backend validates all cart items before creating order

#### Data Flow

**Add to Cart:**

```
User clicks "Add to Cart"
    ↓
React state updated immediately (in-memory)
    ↓
No persistence to localStorage
    ↓
Cart remains until: logout, checkout success, or page refresh
```

**Checkout:**

```
User submits checkout form
    ↓
apiClient.post("/checkout/", {
  cart: [{ productId, quantity }, ...],
  shippingInfo: { fullName, phone, address },
  paymentMethod: "qr" | "cod" | "stripe"
})
    ↓
Backend validates cart items, stock, prices
    ↓
Backend creates Order + OrderItems in database
    ↓
Frontend calls clearCart() (removes from memory)
    ↓
User redirected to /order-success
```

**Page Refresh:**

```
User refreshes page mid-shopping
    ↓
Cart in memory is lost
    ↓
CartProvider initializes with empty cart []
    ↓
User sees empty cart, must re-add items
```

#### Key Code

```typescript
// Cart stored in-memory only
const [cart, setCart] = useState<CartItem[]>([]);

// Reset on logout
useEffect(() => {
  if (!user) {
    setCart([]);
  }
}, [user]);

// Add to cart - immediate memory update
const addToCart = (product) => {
  setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
};

// Checkout sends cart to backend
const handlePlaceOrder = async () => {
  await apiClient.post("/checkout/", {
    cart: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
    // ...
  });
  clearCart(); // Remove from memory after success
};
```

---

### 3. CheckoutPage (`src/app/pages/CheckoutPage.tsx`)

#### Changes

- ✅ Now uses `apiClient.post("/checkout/", ...)` instead of raw `fetch()`
- ✅ Automatic token injection (no manual `Authorization` header)
- ✅ Cleaner error handling using `apiClient` exceptions

#### Key Code

```typescript
// BEFORE
const res = await fetch(`${API_URL}/checkout/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ cart, shippingInfo, paymentMethod }),
});

// AFTER
const data = await apiClient.post("/checkout/", {
  cart: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
  shippingInfo,
  paymentMethod,
});
```

---

## Storage Manager (`src/utils/storageManager.ts`)

### New Structure

- ✅ **TokenStorage**: Minimal token hydration utilities (kept)
- ❌ **UserStorage**: Deprecated (use `/auth/me` endpoint)
- ❌ **CartStorage**: Deprecated (use in-memory CartContext)

### Deprecation Warnings

Old code that calls deprecated functions will log warnings:

```
[DEPRECATED] UserStorage.saveCurrentUser - Use backend API instead
[DEPRECATED] CartStorage.saveCart - Cart is now in-memory only
```

---

## Data Persistence Flows

### User Registration

```
Frontend                        Backend                    Database
Registration Form
    ↓
apiClient.post("/auth/register")
    ├─────────────────────→  Validate username/email exists
    │                        ↓
    │                        Hash password
    │                        ↓
    │                        INSERT INTO users
    │                        ↓
    ←─────── { token, id, ... }
    ↓
Save token to localStorage
Store user in React state
```

### Login

```
Frontend                        Backend                    Database
Login Form
    ↓
apiClient.post("/auth/login")
    ├─────────────────────→  SELECT user WHERE username
    │                        ├─→ Verify password hash
    │                        ←─ User found
    │                        ↓
    │                        Create JWT token
    ←─────── { token, id, ... }
    ↓
Save token to localStorage
Store user in React state
```

### Checkout (Order Creation)

```
Frontend                        Backend                    Database
Checkout Form
    ↓
apiClient.post("/checkout/")
    ├─────────────────────→  Verify user (from token)
    │                        ↓
    │                        For each cart item:
    │                        ├─ SELECT product WHERE id
    │                        ├─ Validate stock
    │                        ├─ Calculate line total
    │                        ↓
    │                        BEGIN TRANSACTION
    │                        ├─ INSERT INTO orders
    │                        ├─ INSERT INTO order_items (for each item)
    │                        ├─ UPDATE product SET stock = stock - qty
    │                        ├─ COMMIT
    │                        ↓
    ←─────── { orderId, total, status }
    ↓
clearCart()
Redirect to /order-success
```

### Order History Fetch

```
Frontend                        Backend                    Database
OrderHistoryPage mount
    ↓
apiClient.get("/checkout/user/history")
    ├─────────────────────→  Verify user (from token)
    │                        ↓
    │                        SELECT orders WHERE user_id
    │                        (with ORDER BY created_at DESC)
    │                        ↓
    ←─────── [ { id, total, status, ... }, ... ]
    ↓
Display in table/list
```

---

## Migration Checklist

If you have existing pages/components using the old localStorage pattern:

### ❌ Old Pattern (Remove)

```typescript
import { CartStorage, UserStorage } from "../../utils/storageManager";

const savedCart = CartStorage.loadCart(userId);
UserStorage.saveCurrentUser(user);
localStorage.getItem("orders-" + userId);
```

### ✅ New Pattern (Use Instead)

**For user data:**

```typescript
import { useAuth } from "../context/AuthContext";

const { user, accessToken } = useAuth();
// user is automatically kept in sync with backend
```

**For cart:**

```typescript
import { useCart } from "../context/CartContext";

const { cart, addToCart, removeFromCart } = useCart();
// cart is in-memory, persisted on checkout
```

**For orders (example - OrderHistoryPage):**

```typescript
const fetchOrders = async () => {
  const orders = await apiClient.get("/checkout/user/history");
  setOrders(orders);
};
```

**For any backend API call:**

```typescript
import { apiClient } from "../../utils/apiClient";

try {
  const data = await apiClient.post("/some/endpoint", {
    /* body */
  });
  // data is already parsed JSON
} catch (error) {
  console.error(error.message, error.status);
}
```

---

## Environment-Specific Considerations

### localhost Development

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:8000`
- Database: SQLite (`app.db` in backend root)
- Token: Stored in localStorage (cross-origin cookies blocked by default)

### Deployed Environment

```typescript
// Option 1: Environment variable
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Option 2: Detect environment
const API_BASE_URL = import.meta.env.PROD
  ? "https://api.yourdomain.com/api"
  : "http://localhost:8000/api";

// Then pass to apiClient constructor
new ApiClient(API_BASE_URL);
```

For production deployment with different domain/port, update `apiClient.ts`:

```typescript
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000/api";
```

Then in `.env.production`:

```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Security Best Practices

### ✅ DO

- **Validate tokens on server side** - Every request to backend should verify token
- **Set token expiration** - Tokens should expire after reasonable time (e.g., 24 hours)
- **Refresh token flow** - Implement refresh tokens for long sessions
- **HTTPS only** - In production, always use HTTPS to protect token in transit
- **Clear token on logout** - Remove from localStorage and state

### ❌ DON'T

- **Store sensitive data in token** - Token should only contain user ID and role
- **Store token in sessionStorage** - Use localStorage for persistence across tabs
- **Store password anywhere** - Never save password in localStorage
- **Send token in URL params** - Always use Authorization header
- **Trust client-side checks** - Backend must validate every request independently

---

## Debugging

### Check Current User State

```typescript
// In browser console
localStorage.getItem("access_token"); // JWT token
// Check React DevTools: AuthContext
```

### Verify Token Validity

```typescript
import { apiClient } from "../../utils/apiClient";

// In console
const user = await apiClient.get("/auth/me");
console.log(user);
```

### Check Cart State

```typescript
// In React DevTools: CartContext
// Or in component:
const { cart } = useCart();
console.log(cart);
```

### Network Debugging

1. Open Browser DevTools → Network tab
2. Perform action (login, checkout, etc.)
3. Look for requests to `localhost:8000/api/...`
4. Check:
   - Request headers: `Authorization: Bearer <token>`
   - Response status: 200 (success), 401 (unauthorized), 400 (validation error)
   - Response body: Contains error details

---

## Common Issues & Solutions

### Issue: "401 Unauthorized" on page refresh

**Cause**: Token expired or invalid
**Solution**:

- Check token expiration time on backend
- Implement refresh token flow
- Force user to re-login

### Issue: Cart cleared on page refresh

**Expected behavior** - This is intentional! Cart is in-memory only.
**User can prevent by**:

- Not refreshing mid-checkout
- Implementing persistent cart on backend (separate `user_cart` table)

### Issue: "CORS error" when calling backend

**Cause**: Browser blocks cross-origin requests
**Solution** on backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Cart still using localStorage

**Cause**: Old component still importing `CartStorage`
**Solution**: Replace with new pattern above

---

## Next Steps

1. **Test all flows**:
   - [ ] Register new user
   - [ ] Login with existing user
   - [ ] Logout
   - [ ] Page refresh after login
   - [ ] Add items to cart
   - [ ] Checkout order
   - [ ] Page refresh mid-checkout (cart should be empty)

2. **Check deployed environment**:
   - [ ] Update API base URL for production
   - [ ] Test API calls to production backend
   - [ ] Verify HTTPS + CORS headers

3. **Admin Dashboard**:
   - [ ] Verify ManageOrders fetches from `/api/admin/orders`
   - [ ] Verify ManageUsers fetches from `/api/admin/users`
   - [ ] Test creating new user/order updates database

4. **Monitor for errors**:
   - [ ] Check browser console for warnings/errors
   - [ ] Check backend logs for API errors
   - [ ] Test network failure scenarios (offline mode)

---

## Summary

Your React SPA now follows a **backend-first architecture**:

| Aspect           | Before                              | After                                         |
| ---------------- | ----------------------------------- | --------------------------------------------- |
| **User data**    | localStorage                        | Backend API + state                           |
| **Cart**         | localStorage + state                | In-memory state only                          |
| **Orders**       | localStorage (manual)               | Persisted via API                             |
| **Auth token**   | localStorage (unvalidated)          | localStorage (hydration) + backend validation |
| **API calls**    | Raw `fetch()` everywhere            | Centralized `apiClient`                       |
| **Environments** | Isolated (localStorage per browser) | Synchronized (database)                       |

All UI/styling remains unchanged ✅ Only data layer refactored ✅
