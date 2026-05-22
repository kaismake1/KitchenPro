# Guest Checkout - Setup & Troubleshooting Guide

## What Was Changed

The e-commerce site has been modified to support **guest checkout** (no account required):

### 1. **Backend Changes**

- ✅ Modified `Order` model to allow `user_id=NULL` for guest orders
- ✅ Updated `/api/checkout/` endpoint to accept both authenticated users and guests
- ✅ Added error handling and logging for checkout operations

### 2. **Frontend Changes**

- ✅ Removed authentication requirement from checkout page
- ✅ Removed "Add to Cart" login requirement from products
- ✅ Improved error handling in API client for better error messages

## Database Schema Update

The `Order` table's `user_id` column changed from **NOT NULL** to **NULLABLE**.

⚠️ **If you're getting "Failed to fetch" error**, the database likely still has the old schema.

### Solution: Reset the Database

Since SQLAlchemy's `create_all()` doesn't modify existing tables, you need to recreate the database:

#### **Step 1: Stop the Backend**

- Press `Ctrl+C` in the terminal running the backend

#### **Step 2: Run Database Reset**

```bash
cd "c:\E-commerce Website UI Design (1)"
python reset_database.py
```

Then type `yes` when prompted to confirm.

#### **Step 3: Restart the Backend**

```bash
# On Windows
run_backend.bat

# On macOS/Linux
./run_backend.sh
```

## Guest Checkout Flow

### For Guests (No Account):

1. Browse products
2. Click "Add to Cart" → No login required ✅
3. Click cart icon → Go to checkout
4. Fill in shipping info (name, phone, address)
5. Choose payment method (QR/Transfer or COD)
6. Complete order → No account needed ✅

### For Registered Users:

- Can still login and checkout normally
- Orders are tracked in account history
- Same experience as before

## How to Test Guest Checkout

1. **Clear browser data** (localStorage) to simulate a fresh guest
2. **Go to home page** and add a product to cart
3. **Click checkout**
4. **Fill shipping info** and place order
5. **Should see success** without any login requirement

## Troubleshooting

### "Failed to fetch" Error

→ Run the database reset script (see above)

### "Insufficient stock" Error

→ This is expected if items are out of stock. Check `/admin` to update stock levels.

### Order not created

→ Check backend terminal for error logs
→ Verify all required fields are filled (fullName, phone, address)

### CORS or Network Error

→ Make sure backend is running: `http://localhost:8000/health`
→ Check if port 8000 is already in use

## Database Files Location

**SQLite Database:** `c:\E-commerce Website UI Design (1)\ecommerce.db`

⚠️ The `reset_database.py` script will delete this file and recreate it with new schema.

## API Endpoint Details

### POST `/api/checkout/`

**Request (Guest Example):**

```json
{
  "cart": [{ "productId": 1, "quantity": 2 }],
  "shippingInfo": {
    "fullName": "Nguyễn Văn A",
    "phone": "0987654321",
    "address": "123 Nguyễn Hue, HCMC"
  },
  "paymentMethod": "cod"
}
```

**Response:**

```json
{
  "orderId": "uuid-here",
  "total": 5000000,
  "status": "pending",
  "redirect_url": null
}
```

### For Authenticated Users:

The endpoint still works the same, but will link the order to the user account if `Authorization: Bearer {token}` is provided.

## Files Modified

1. `backend/models/orm.py` - Made `Order.user_id` nullable
2. `backend/api/checkout.py` - Support guest checkout
3. `backend/db.py` - Added `reset_db()` function
4. `src/app/pages/CheckoutPage.tsx` - Removed auth requirement
5. `src/app/components/Products.tsx` - Removed cart login requirement
6. `src/utils/apiClient.ts` - Improved error handling

## New Files Added

- `reset_database.py` - Utility to reset database to current schema

---

**Need Help?**

- Check backend logs for detailed errors
- Verify backend is running: `http://localhost:8000/docs`
- Ensure database reset completed successfully
