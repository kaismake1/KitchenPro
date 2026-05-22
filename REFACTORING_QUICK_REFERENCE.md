# Backend Refactoring: Before & After Code Examples

## Quick Reference for Common Patterns

---

## Pattern 1: Fetching User Data

### ❌ BEFORE (localStorage-based)

```typescript
// Old approach: Store user in localStorage
const user = JSON.parse(localStorage.getItem("user") || "{}");
console.log(user.username);
```

### ✅ AFTER (backend-first)

```typescript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>{user.username}</div>;
}
```

**Benefits:**

- User data always fresh from backend
- Automatic validation on page refresh
- No localStorage bloat

---

## Pattern 2: Making API Calls with Authentication

### ❌ BEFORE (raw fetch)

```typescript
import { useAuth } from "../context/AuthContext";

function OrdersPage() {
  const { accessToken } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8000/api/checkout/user/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ← Manual header
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, [accessToken]);
}
```

### ✅ AFTER (centralized API client)

```typescript
import { apiClient } from "../../utils/apiClient";

function OrdersPage() {
  useEffect(() => {
    apiClient
      .get("/checkout/user/history") // ← Auto token injection
      .then((data) => console.log(data))
      .catch((error) => console.error(error.message));
  }, []);
}
```

**Benefits:**

- Token automatically injected
- No manual header management
- Consistent error handling
- Single source of truth for API logic

---

## Pattern 3: Saving User to localStorage

### ❌ BEFORE (manual storage)

```typescript
function LoginPage() {
  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    // Manual localStorage management
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("access_token", data.access_token);

    navigate("/dashboard");
  };
}
```

### ✅ AFTER (context-managed)

```typescript
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      navigate("/dashboard");
    }
  };
}
```

**Benefits:**

- Automatic user state management
- Token validation on hydration
- No manual localStorage calls
- Consistent logout behavior

---

## Pattern 4: Cart Management

### ❌ BEFORE (localStorage + state)

```typescript
import { CartStorage } from "../../utils/storageManager";
import { useAuth } from "../context/AuthContext";

function CartProvider() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedCart = CartStorage.loadCart(user.id);
      setCart(savedCart);
    }
  }, [user]);

  // Save to localStorage on every change
  useEffect(() => {
    if (user) {
      CartStorage.saveCart(user.id, cart);
    }
  }, [cart, user]);
}
```

### ✅ AFTER (in-memory only)

```typescript
function CartProvider() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setCart([]);
    }
  }, [user]);

  // That's it! Cart is in-memory only
}
```

**Benefits:**

- No localStorage bloat
- Simpler logic
- Cart persisted via checkout API
- Cart cleared on logout automatically

---

## Pattern 5: Checkout Flow

### ❌ BEFORE (cart from localStorage, order saved to localStorage)

```typescript
import { CartStorage } from "../../utils/storageManager";

async function handleCheckout(shippingInfo, paymentMethod) {
  // Load cart from localStorage
  const cart = CartStorage.loadCart(userId);

  // Send to backend
  const res = await fetch("http://localhost:8000/api/checkout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ cart, shippingInfo, paymentMethod }),
  });

  if (res.ok) {
    const order = await res.json();

    // Manually clear localStorage
    CartStorage.removeCart(userId);
    localStorage.setItem("lastOrder", JSON.stringify(order));

    navigate("/order-success");
  }
}
```

### ✅ AFTER (cart from context, order persisted via API)

```typescript
import { useCart } from "../context/CartContext";
import { apiClient } from "../../utils/apiClient";

async function handleCheckout(shippingInfo, paymentMethod) {
  // Get cart from context
  const { cart, clearCart } = useCart();

  // Send to backend
  const order = await apiClient.post("/checkout/", {
    cart: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
    shippingInfo,
    paymentMethod,
  });

  // Clear cart and redirect
  clearCart();
  navigate("/order-success");
}
```

**Benefits:**

- No localStorage cart management
- Order persisted in database (not localStorage)
- Cleaner error handling
- No manual state cleanup

---

## Pattern 6: Admin Operations

### ❌ BEFORE (mixed localStorage + API)

```typescript
function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Mix of localStorage and API
    const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(localUsers);
  }, []);

  const handleAddUser = async (newUser) => {
    // Add to localStorage
    const updated = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);

    // MIGHT call API, but not guaranteed
  };
}
```

### ✅ AFTER (API-first)

```typescript
import { apiClient } from "../../utils/apiClient";
import { useAuth } from "../context/AuthContext";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const { accessToken, isAdmin } = useAuth();

  useEffect(() => {
    loadUsers();
  }, [accessToken, isAdmin]);

  const loadUsers = async () => {
    if (accessToken && isAdmin) {
      const data = await apiClient.get("/admin/users");
      setUsers(data);
    }
  };

  const handleAddUser = async (newUser) => {
    const result = await apiClient.post("/admin/users", newUser);
    setUsers([...users, result]);
  };
}
```

**Benefits:**

- Single source of truth (database)
- Admin users always in sync
- Automatic token validation
- Changes reflected across all sessions

---

## Pattern 7: Error Handling

### ❌ BEFORE (verbose error handling)

```typescript
const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.detail || error.message || "Error");
      return;
    }

    const data = await res.json();
    // ... handle success
  } catch (error) {
    toast.error("Network error");
  }
};
```

### ✅ AFTER (clean error handling)

```typescript
const handleLogin = async () => {
  try {
    const data = await apiClient.post("/auth/login", { username, password });
    // ... handle success
  } catch (error: any) {
    toast.error(error.message); // ← Automatic error extraction
  }
};
```

**Benefits:**

- Shorter, cleaner code
- Consistent error format
- Automatic JSON parsing
- Type-safe error object

---

## Pattern 8: Token Management

### ❌ BEFORE (manual token handling everywhere)

```typescript
// In AuthContext
const token = localStorage.getItem("access_token");
// In CheckoutPage
Authorization: `Bearer ${accessToken}`,
// In OrderHistory
headers: { Authorization: `Bearer ${token}` }
// Manual token refresh logic needed
```

### ✅ AFTER (centralized token management)

```typescript
// In apiClient
private getToken(): string | null {
  return localStorage.getItem("access_token");
}

private async handleResponse(response: Response) {
  if (response.status === 401) {
    TokenManager.clearToken();
    // redirect to login or trigger refresh
  }
}

// In components - no token handling needed!
const data = await apiClient.get("/any/endpoint");
```

**Benefits:**

- Token injected automatically
- Single place to handle expiration
- No token string scattered in codebase
- Easy to implement refresh flow

---

## Migration Checklist

### Step 1: Update Imports

```typescript
// ❌ Remove
import { CartStorage, UserStorage } from "../../utils/storageManager";

// ✅ Add
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../../utils/apiClient";
```

### Step 2: Replace localStorage Calls

**User data:**

```typescript
// ❌ OLD
const user = JSON.parse(localStorage.getItem("user") || "{}");

// ✅ NEW
const { user } = useAuth();
```

**Cart data:**

```typescript
// ❌ OLD
const cart = CartStorage.loadCart(userId);
CartStorage.saveCart(userId, newCart);

// ✅ NEW
const { cart, addToCart } = useCart();
```

**Orders data:**

```typescript
// ❌ OLD
const orders = JSON.parse(localStorage.getItem("orders-" + userId) || "[]");

// ✅ NEW
const orders = await apiClient.get("/checkout/user/history");
```

### Step 3: Replace fetch() Calls

```typescript
// ❌ OLD
fetch("http://localhost:8000/api/endpoint", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify(data),
});

// ✅ NEW
apiClient.post("/endpoint", data);
```

### Step 4: Test

- [ ] Login / Register
- [ ] Page refresh (should keep user logged in)
- [ ] Logout (should clear user)
- [ ] Add to cart
- [ ] Checkout
- [ ] View order history
- [ ] Admin operations (if applicable)

---

## API Reference

### GET Requests

```typescript
// Get current user
const user = await apiClient.get("/auth/me");

// Get user's orders
const orders = await apiClient.get("/checkout/user/history");

// Get all admin users
const users = await apiClient.get("/admin/users");
```

### POST Requests

```typescript
// Register
await apiClient.post("/auth/register", { username, email, password });

// Login
await apiClient.post("/auth/login", { username, password });

// Create order
await apiClient.post("/checkout/", { cart, shippingInfo, paymentMethod });

// Create user (admin)
await apiClient.post("/admin/users", { username, email, password, role });
```

### PATCH Requests

```typescript
// Update order status (admin)
await apiClient.patch("/admin/orders/{orderId}", { status: "shipped" });
```

### DELETE Requests

```typescript
// Delete order (admin)
await apiClient.delete("/admin/orders/{orderId}");
```

---

## Summary Table

| Task           | Before                      | After                  |
| -------------- | --------------------------- | ---------------------- |
| Get user       | localStorage + JSON.parse   | useAuth hook           |
| Get orders     | localStorage + manual API   | apiClient.get()        |
| Save cart      | CartStorage.saveCart()      | In-memory state        |
| Checkout       | Manual fetch + localStorage | apiClient.post()       |
| API calls      | Raw fetch everywhere        | apiClient wrapper      |
| Error handling | Try-catch + response.json() | Automatic in apiClient |
| Token mgmt     | Manual header injection     | Automatic in apiClient |
| Login          | Manual state + localStorage | useAuth.login()        |

---

## Troubleshooting

### "useAuth is undefined"

```typescript
// ❌ Wrong
import { useAuth } from "AuthContext";

// ✅ Correct
import { useAuth } from "../context/AuthContext";
```

### "apiClient is not defined"

```typescript
// ❌ Wrong
import apiClient from "../../utils/apiClient";

// ✅ Correct
import { apiClient } from "../../utils/apiClient";
```

### "Cart is cleared on refresh"

✅ This is expected! Cart is in-memory only. To persist across refreshes, implement a `user_cart` table in database.

### "401 Unauthorized" on API calls

Check:

1. Is user logged in? `useAuth()` returns `user === null`
2. Is token valid? Check localStorage: `localStorage.getItem("access_token")`
3. Has token expired? Backend returns 401, should trigger refresh/re-login

### Network requests not showing Authorization header

Debug in browser DevTools:

1. Open Network tab
2. Look for request to API endpoint
3. Click on request, go to "Headers"
4. Look for `Authorization: Bearer ...`
5. If missing, check `apiClient.getToken()` returns value
