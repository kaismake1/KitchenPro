# Refactoring Summary & Testing Guide

## Files Changed

### New Files Created ✨

1. **`src/utils/apiClient.ts`** - Centralized API client with automatic token injection
2. **`BACKEND_REFACTORING_GUIDE.md`** - Comprehensive architecture guide
3. **`REFACTORING_QUICK_REFERENCE.md`** - Before/after code examples

### Files Modified 🔄

| File                              | Changes                                       | Impact                                       |
| --------------------------------- | --------------------------------------------- | -------------------------------------------- |
| `src/app/context/AuthContext.tsx` | Now uses `apiClient` instead of raw `fetch()` | Better error handling, centralized API logic |
| `src/app/context/CartContext.tsx` | **Removed all localStorage calls**            | Cart is in-memory only, simpler code         |
| `src/app/pages/CheckoutPage.tsx`  | Updated to use `apiClient`                    | Automatic token injection                    |
| `src/utils/storageManager.ts`     | Deprecated old functions, kept `TokenStorage` | Cleaner, reduced dependencies                |

### NOT Changed (No UI Changes) ✅

- ✅ No React component UI touched
- ✅ No Tailwind CSS classes modified
- ✅ No shadcn/ui components altered
- ✅ No layouts changed
- ✅ No styling modifications
- ✅ All visual designs preserved

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  React Components (UI unchanged)        │
│  ├─ LoginPage, RegisterPage             │
│  ├─ CheckoutPage                        │
│  ├─ OrderHistoryPage                    │
│  └─ Admin Pages                         │
└────────────┬────────────────────────────┘
             │
        ┌────▼─────────────────────┐
        │  React Contexts          │
        ├─ AuthContext             │
        │  ├─ user state           │
        │  ├─ login/register       │
        │  └─ token management     │
        ├─ CartContext             │
        │  ├─ cart state (memory)  │
        │  └─ add/remove/clear     │
        └────┬────────────────────┬┘
             │                    │
             │  ┌────────────────┐│
             └──┤ API Client     ││
                ├─ get()         ││
                ├─ post()        ││
                ├─ patch()       ││
                └─ delete()      ││
                   Token mgmt   ││
                   Error handler││
                └────────────────┘
                      │
                      │ HTTP Requests
                      ▼
        ┌─────────────────────────┐
        │ FastAPI Backend         │
        │ (http://localhost:8000) │
        │                         │
        │ ├─ /api/auth/*          │
        │ ├─ /api/checkout/*      │
        │ ├─ /admin/*             │
        │ └─ Validation & Auth    │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ SQLite Database         │
        │ (Persistent Storage)    │
        │                         │
        │ ├─ users table          │
        │ ├─ products table       │
        │ ├─ orders table         │
        │ ├─ order_items table    │
        │ └─ product_images table │
        └─────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Registration/Login

```
User fills form
      ↓
POST /auth/register or /auth/login
      ↓
Backend validates & creates JWT token
      ↓
Returns { id, username, email, role, access_token }
      ↓
AuthContext stores user in state + token in localStorage
      ↓
User redirected to dashboard
```

### 2. Page Refresh (Hydration)

```
App loads
      ↓
AuthContext useEffect runs
      ↓
Check localStorage for access_token
      ↓
If found: GET /auth/me with token
      ↓
Backend validates token & returns user
      ↓
If valid: Restore user state
If invalid: Clear token, redirect to login
```

### 3. Add to Cart

```
User clicks "Add to Cart"
      ↓
CartContext updates state
      ↓
No persistence to storage (in-memory only)
      ↓
UI updates immediately
```

### 4. Checkout

```
User fills shipping form
      ↓
POST /checkout/ with cart items
      ↓
Backend:
  - Validates user (from token)
  - Validates cart items (stock, prices)
  - Creates Order + OrderItems
  - Updates product stock
  - Returns orderId
      ↓
Frontend:
  - clearCart() (removes from memory)
  - Redirect to /order-success
      ↓
Order persisted in database ✅
```

### 5. Order History

```
User navigates to /order-history
      ↓
GET /checkout/user/history
      ↓
Backend returns all user's orders
      ↓
Frontend displays in table
```

---

## Testing Checklist

### ✅ Authentication

- [ ] **Register new user**
  - [ ] Navigate to /register
  - [ ] Fill form with new credentials
  - [ ] Click register
  - [ ] Should redirect to dashboard
  - [ ] User name should appear in header
  - [ ] Token saved in localStorage

- [ ] **Login existing user**
  - [ ] Navigate to /login
  - [ ] Enter valid credentials
  - [ ] Click login
  - [ ] Should redirect to dashboard
  - [ ] Verify user data is from database (not localStorage)

- [ ] **Page refresh after login**
  - [ ] Login to account
  - [ ] Refresh page (F5)
  - [ ] Should still be logged in
  - [ ] User data should load automatically
  - [ ] No "401 Unauthorized" errors

- [ ] **Logout**
  - [ ] Click logout button
  - [ ] Should redirect to login page
  - [ ] Token removed from localStorage
  - [ ] Cart cleared

- [ ] **Invalid credentials**
  - [ ] Try login with wrong password
  - [ ] Should show error toast
  - [ ] Should NOT redirect

### ✅ Cart Management

- [ ] **Add to cart**
  - [ ] From products page, click "Add to Cart"
  - [ ] Item should appear in cart
  - [ ] Cart count should update
  - [ ] Open DevTools → Console (no localStorage warnings)

- [ ] **Remove from cart**
  - [ ] In cart, click delete
  - [ ] Item should disappear
  - [ ] Cart count should update

- [ ] **Update quantity**
  - [ ] In cart, change quantity
  - [ ] Total should recalculate
  - [ ] UI should update immediately

- [ ] **Cart on page refresh**
  - [ ] Add items to cart
  - [ ] Refresh page (F5)
  - [ ] Cart should be EMPTY ✅ (expected behavior)
  - [ ] User must re-add items

- [ ] **Cart on logout**
  - [ ] Add items to cart
  - [ ] Click logout
  - [ ] After logout, cart should be empty
  - [ ] After re-login, cart should be empty

### ✅ Checkout

- [ ] **Complete checkout flow**
  - [ ] Login
  - [ ] Add items to cart
  - [ ] Navigate to checkout
  - [ ] Review order summary
  - [ ] Select payment method
  - [ ] Fill shipping information
  - [ ] Click place order
  - [ ] Should show success message
  - [ ] Should redirect to /order-success
  - [ ] Order should be saved to database

- [ ] **Checkout with empty cart**
  - [ ] Login
  - [ ] Go to checkout with empty cart
  - [ ] Should show "Cart is empty" message

- [ ] **Checkout validation**
  - [ ] Try checkout without filling shipping info
  - [ ] Should show error messages
  - [ ] Should not submit to backend

- [ ] **Insufficient stock**
  - [ ] Add item with quantity > available stock
  - [ ] Try checkout
  - [ ] Backend should reject with error message

### ✅ Order History

- [ ] **View past orders**
  - [ ] Navigate to /order-history
  - [ ] Should show list of all user's orders
  - [ ] Each order shows: ID, date, status, total

- [ ] **Order details**
  - [ ] Click expand on order
  - [ ] Should show order items
  - [ ] Should show shipping info
  - [ ] Should show payment method

### ✅ API Client

- [ ] **Automatic token injection**
  - [ ] Open DevTools → Network
  - [ ] Make any authenticated request (get orders, checkout, etc)
  - [ ] In request headers, should see: `Authorization: Bearer {token}`

- [ ] **Error handling**
  - [ ] Try invalid login
  - [ ] Should show error toast (not crash)
  - [ ] Console should log error details

- [ ] **Token expiration**
  - [ ] Wait for token to expire (if configured)
  - [ ] Make request to API
  - [ ] Should get 401 response
  - [ ] Should redirect to login

### ✅ Admin Features (if applicable)

- [ ] **View all orders**
  - [ ] Login as admin
  - [ ] Go to admin panel
  - [ ] Should show orders from ALL users
  - [ ] NOT just current user

- [ ] **Create user**
  - [ ] Click "Add User" button
  - [ ] Fill form
  - [ ] Should save to database
  - [ ] New user should appear in list

- [ ] **Update order status**
  - [ ] Select order, change status
  - [ ] Should update in database
  - [ ] Refresh page, status should persist

---

## Debugging Tools

### Browser Console Commands

```javascript
// Check if user is logged in
localStorage.getItem("access_token");

// Get current user from AuthContext (via React DevTools)
// Open React DevTools → Components → Find AuthContext

// Check cart state (via React DevTools)
// Open React DevTools → Components → Find CartContext

// Make manual API call
const token = localStorage.getItem("access_token");
fetch("http://localhost:8000/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((r) => r.json())
  .then(console.log);
```

### Network Debugging (DevTools)

1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, checkout, etc.)
4. Click on request to API endpoint
5. Check:
   - **Headers** tab: Should see `Authorization: Bearer ...`
   - **Response** tab: Should see JSON data or error details
   - **Status**: 200 (success), 401 (unauthorized), 400 (validation error)

### Backend Logs

Run backend in terminal to see real-time logs:

```bash
cd "c:\E-commerce Website UI Design (1)"
python -m backend.main
```

Look for:

- `INFO:` - Normal operations
- `ERROR:` - Problems
- API request logs

---

## Common Issues & Solutions

### Issue: 401 Unauthorized

**Symptoms:**

- Can't access protected endpoints
- Getting 401 responses

**Solutions:**

1. Check if user is logged in: `localStorage.getItem("access_token")`
2. Check if token is sent in headers (DevTools → Network)
3. Check if token is expired (backend logs)
4. Try re-login to get fresh token

### Issue: CORS Errors

**Symptoms:**

- "Cross-Origin Request Blocked" in console
- API calls fail

**Solutions:**

1. Check backend has CORS middleware enabled
2. Check allowed origins include `http://localhost:5174`
3. Restart backend server

### Issue: Cart Empty After Refresh

**Expected behavior** - Cart is in-memory only!

**To persist cart across refreshes:**

- Need to implement `user_cart` table in database
- Sync cart to backend on every change
- Load cart from backend on startup
- (More complex, not required for MVP)

### Issue: Can't Create New User (Admin)

**Check:**

1. Are you logged in as admin? `useAuth().isAdmin`
2. Is "Add User" button visible?
3. Check browser console for error messages
4. Check backend logs for validation errors

### Issue: Token Never Injected in Headers

**Check:**

1. Is `apiClient` being used? (Not raw `fetch`)
2. Is token in localStorage? `localStorage.getItem("access_token")`
3. Check `apiClient.ts` is not throwing errors
4. Try hard reload: Ctrl+Shift+R

---

## Deployment Checklist

### Before Deploying

- [ ] All tests passing ✅
- [ ] No console errors
- [ ] No localStorage calls in new code
- [ ] All API endpoints use `apiClient`
- [ ] Token validation works on page refresh
- [ ] Cart clears on logout
- [ ] Checkout creates database orders

### Environment Configuration

```typescript
// In production, update API base URL
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:8000/api";

// Set in .env.production
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend Deployment

- [ ] Backend running on production server
- [ ] Database has tables: users, products, orders, order_items
- [ ] CORS middleware configured for production domain
- [ ] JWT secret configured in backend `.env`
- [ ] Database backups automated

---

## Performance Optimizations (Optional)

### Caching User Data

```typescript
// Optional: Cache user data instead of fetching on every refresh
const [cachedUser, setCachedUser] = useState(null);

useEffect(() => {
  const token = TokenManager.getToken();
  if (token && !cachedUser) {
    apiClient.get("/auth/me").then(setCachedUser);
  }
}, []);
```

### Reducing API Calls

```typescript
// Batch requests
const [orders, setOrders] = useState(null);
const [user, setUser] = useState(null);

useEffect(() => {
  Promise.all([
    apiClient.get("/auth/me"),
    apiClient.get("/checkout/user/history"),
  ]).then(([userData, orderData]) => {
    setUser(userData);
    setOrders(orderData);
  });
}, []);
```

### Implementing Pagination

```typescript
// For large order lists
const fetchOrders = async (page = 1) => {
  const orders = await apiClient.get(
    `/checkout/user/history?page=${page}&limit=10`,
  );
};
```

---

## Next Steps

1. **Test everything** - Use the checklist above
2. **Check for localStorage calls** - Search codebase for `localStorage.setItem` / `localStorage.getItem`
3. **Update any other pages** - If you have other pages using old patterns, migrate them
4. **Deploy to staging** - Test on staging environment first
5. **Deploy to production** - Update API base URL, deploy, verify

---

## Quick Command Reference

```bash
# Start backend
cd "c:\E-commerce Website UI Design (1)"
python -m backend.main

# In another terminal, start frontend
npm run dev

# View localhost
http://localhost:5174

# Backend API base
http://localhost:8000/api

# Test API
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

---

## Summary

✅ **What's new:**

- Centralized API client (`apiClient.ts`)
- Backend-first data layer
- In-memory cart (no localStorage)
- Automatic token injection
- Clean error handling

❌ **What's removed:**

- localStorage-based cart
- Manual token header injection
- Direct fetch() calls everywhere
- localStorage-based user storage

✨ **Result:**

- Cleaner, more maintainable code
- Better error handling
- Data synced across environments
- Ready for production deployment
