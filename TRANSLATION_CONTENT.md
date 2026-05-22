# E-Commerce Website - Vietnamese Translation Content List

## Overview
This document contains ALL user-facing text content that requires translation to Vietnamese, organized by file type and component.

---

## 1. HEADER COMPONENT
**File:** `src/app/components/Header.tsx`

### Navigation Links
- `Home`
- `Products`
- `Categories`
- `About`
- `Contact`
- `Admin` (appears for admin users only)

### Search Bar
- `Search for appliances...` (placeholder)

### User Menu Items
- `Order History`
- `Admin Panel`
- `Logout`

### Login Link (tooltip/aria)
- Login icon used in header

---

## 2. FOOTER COMPONENT
**File:** `src/app/components/Footer.tsx`

### Company Info Section
- `KitchenPro` (brand name - may or may not translate)
- `Premium Scandinavian kitchen appliances for the modern home. Quality you can trust.`

### Quick Links Section
- Section Title: `Quick Links`
- `About Us`
- `Products`
- `Categories`
- `Warranty`
- `Support`

### Support Section
- Section Title: `Support`
- `FAQs`
- `Shipping Info`
- `Returns`
- `Privacy Policy`
- `Terms of Service`

### Contact Section
- Section Title: `Contact Us`
- `123 Kitchen Avenue, Stockholm, Sweden` (sample address)
- `+46 123 456 7890` (phone number)
- `info@kitchenpro.com` (email)

### Newsletter Section
- Section Title: `Subscribe to Our Newsletter`
- `Get the latest updates on new products and promotions`
- Input Placeholder: `Enter your email`
- Button: `Subscribe`

### Copyright
- `&copy; 2026 KitchenPro. All rights reserved.`

---

## 3. HERO SECTION
**File:** `src/app/components/Hero.tsx`

- Main Heading: `Modern Kitchen Solutions`
- Subheading: `Premium Scandinavian appliances for the contemporary home`
- Button: `Shop Now`

---

## 4. PRODUCTS COMPONENT
**File:** `src/app/components/Products.tsx`

### Section Header
- Heading: `Our Products`
- Subheading: `Discover premium quality appliances for your kitchen`

### Filter Categories
- `All`
- `Ovens`
- `Refrigerators`
- `Dishwashers`
- `Microwaves`
- `Cooker Hoods`

### Product Card Elements
- Stock Status Badges:
  - `Out of Stock`
  - `Coming Soon`
  - `In Stock`
- Badge Examples: `Bestseller`, `New`, `Premium`

### Toast Messages
- `Please login to add items to cart`
- `This product is not available`
- `{product.name} added to cart!`

---

## 5. PRODUCT DETAIL PAGE
**File:** `src/app/pages/ProductDetailPage.tsx`

### Navigation
- Link Text: `Back to Products`

### Product Info
- `Description` (section heading)
- Product Rating with Star Display
- Stock Status: 
  - `In Stock ({quantity} available)`
  - `Out of Stock`

### Action Buttons
- `Add to Cart`
- `Out of Stock` (disabled button text)

### Features Section
- `Free Shipping`
- `10-Year Warranty`
- `Easy Returns`

### Product Not Found
- `Product not found`
- `Return to home`

---

## 6. CATEGORIES COMPONENT
**File:** `src/app/components/Categories.tsx`

### Section Header
- Heading: `Featured Categories`
- Subheading: `Explore our range of premium kitchen appliances`

### Category Names (with product counts)
- `Ovens` - `24 Products`
- `Refrigerators` - `18 Products`
- `Dishwashers` - `15 Products`
- `Microwaves` - `12 Products`
- `Cooker Hoods` - `10 Products`
- `Smart Appliances` - `8 Products`

### Pagination Controls
- `Previous`
- `Next`
- Page Numbers (1, 2, 3, etc.)

---

## 7. PROMO BANNER COMPONENT
**File:** `src/app/components/PromoBanner.tsx`

### Promo Content
- Badge: `Limited Time Offer`
- Heading: `Save Up to 30% on Smart Appliances`
- Subheading: `Upgrade your kitchen with our latest collection of intelligent appliances`
- Button: `Shop Sale`

### Countdown Timer
- Section Title: `Offer Ends In:`
- Time Unit Labels:
  - `Days`
  - `Hours`
  - `Minutes`
  - `Seconds`

---

## 8. ABOUT COMPONENT
**File:** `src/app/components/About.tsx`

### Features
- Feature Titles and Descriptions:
  1. Title: `Premium Quality` | Description: `Crafted with precision and built to last for generations`
  2. Title: `Smart Technology` | Description: `Intelligent features that make your life easier`
  3. Title: `10-Year Warranty` | Description: `Comprehensive protection for your investment`

### Main Content
- Main Heading: `Elevate Your Kitchen Experience`
- Body Text: `We believe in creating appliances that combine Scandinavian design aesthetics with cutting-edge technology. Our commitment to quality and innovation has made us a trusted name in modern kitchens worldwide.`

### Achievement Badge
- `25+`
- `Years of Excellence`

### Button
- `Learn More About Us`

---

## 9. TESTIMONIALS COMPONENT
**File:** `src/app/components/Testimonials.tsx`

### Section Header
- Heading: `What Our Customers Say`
- Subheading: `Join thousands of satisfied customers worldwide`

### Testimonial Data
#### Customer 1
- Name: `Sarah Johnson`
- Role: `Home Chef`
- Text: `The smart refrigerator has completely transformed my kitchen. The design is stunning and the technology is incredible. Best investment I've made for my home!`

#### Customer 2
- Name: `Michael Chen`
- Role: `Professional Chef`
- Text: `As a professional chef, I demand the best. These appliances deliver exceptional performance and reliability. The oven's precision is unmatched.`

#### Customer 3
- Name: `Emma Williams`
- Role: `Interior Designer`
- Text: `The Scandinavian design aesthetic perfectly complements modern kitchens. My clients are always impressed with the quality and style.`

---

## 10. LOGIN PAGE
**File:** `src/app/pages/LoginPage.tsx`

### Page Header
- Heading: `Welcome Back`
- Subheading: `Sign in to your account`

### Form Labels & Placeholders
- Label: `Username`
- Placeholder: `Enter your username`
- Label: `Password`
- Placeholder: `Enter your password`

### Validation Errors
- `Username is required`
- `Password is required`
- `Invalid credentials` (for both fields on failed login)

### Form Button
- Button Text (loading): `Signing in...`
- Button Text (normal): `Sign In`

### Demo Credentials Section
- Title: `Demo Credentials:`
- Admin Credentials: `Admin - Username: admin, Password: 123`
- Alternative: `Or create a new account below`

### Register Link
- `Don't have an account?`
- Link Text: `Sign up`

---

## 11. REGISTER PAGE
**File:** `src/app/pages/RegisterPage.tsx`

### Page Header
- Heading: `Create Account`
- Subheading: `Join KitchenPro today`

### Form Labels & Placeholders
- Label: `Username`
- Placeholder: `Choose a username`
- Label: `Email`
- Placeholder: `Enter your email`
- Label: `Password`
- Placeholder: `Create a password`
- Label: `Confirm Password`
- Placeholder: `Confirm your password`

### Validation Errors
- `Username is required`
- `Username must be at least 3 characters`
- `Email is required`
- `Invalid email format`
- `Password is required`
- `Password must be at least 3 characters`
- `Passwords do not match`
- `Username already exists`
- `Username already taken`

### Form Button
- Button Text (loading): `Creating account...`
- Button Text (normal): `Create Account`

### Login Link
- `Already have an account?`
- Link Text: `Sign in`

### Toast Messages
- `Account created successfully!`
- `Username already exists`
- `An error occurred. Please try again.`

---

## 12. CART PAGE
**File:** `src/app/pages/CartPage.tsx`

### Empty Cart State
- Heading: `Your cart is empty`
- Message: `Start shopping to add items to your cart`
- Button: `Continue Shopping`

### Cart Items
- Page Heading: `Shopping Cart`
- Item Quantity Controls (icons)
- Remove Button Text (via icon tooltip): `Remove from cart`

### Toast Messages
- `Your cart is empty` (on checkout click)
- `Item removed from cart`

### Order Summary Section
- Section Title: `Order Summary`
- `Subtotal`
- `Shipping`
- `Free` (for shipping)
- `Total`
- Button: `Proceed to Checkout`
- Button: `Continue Shopping`

---

## 13. CHECKOUT PAGE
**File:** `src/app/pages/CheckoutPage.tsx`

### Page Header
- `Checkout`

### Progress Steps
- Step 1: `Cart Review` (icon: Package)
- Step 2: `Payment` (icon: CreditCard)
- Step 3: `Shipping` (icon: MapPin)
- Step 4: `Confirm` (icon: CheckCircle)

### Step 1 - Cart Review
- Heading: `Review Your Order`
- Button: `Continue to Payment`
- Display: `Total:` label

### Step 2 - Payment Selection
- Heading: `Select Payment Method`
- Option 1: 
  - Title: `QR Code / Banking`
  - Description: `Pay via bank transfer`
  - QR Display Text: `Scan QR code to pay:`
  - Placeholder: `[QR Code Placeholder]`
- Option 2:
  - Title: `Cash on Delivery`
  - Description: `Pay when you receive`
- Buttons: `Back` | `Continue to Shipping`

### Step 3 - Shipping Information
- Heading: `Shipping Information`
- Label: `Full Name`
- Placeholder: `John Doe`
- Label: `Phone Number`
- Placeholder: `+46 123 456 789`
- Label: `Delivery Address`
- Placeholder: `123 Kitchen Avenue, Stockholm, Sweden`
- Validation Errors:
  - `Full name is required`
  - `Phone number is required`
  - `Address is required`
- Buttons: `Back` | `Continue to Confirmation`

### Step 4 - Order Confirmation
- Heading: `Confirm Your Order`
- `Order Summary` (section heading)
- `Payment Method` (section heading)
- `Shipping Information` (section heading)
- Display Fields:
  - `Name:` label
  - `Phone:` label
  - `Address:` label
- Buttons: `Back` | `Place Order`

### Loading States
- `Loading...`

### Toast Messages
- `Please login to continue`
- `Order placed successfully!`

---

## 14. ORDER SUCCESS PAGE
**File:** `src/app/pages/OrderSuccessPage.tsx`

- Main Heading: `Order Placed Successfully!`
- Message: `Thank you for your purchase. Your order has been received and is being processed.`
- Button 1: `View Orders`
- Button 2: `Continue Shopping`

---

## 15. ORDER HISTORY PAGE
**File:** `src/app/pages/OrderHistoryPage.tsx`

### Page Header
- `Order History`

### Empty State
- Heading: `No orders yet`
- Message: `Start shopping to see your orders here`

### Order List Items
- Order ID Prefix: `Order #`
- Order Status Badge: `{status}` (e.g., "pending")
- Items Count Label: `Items:`
- Shipper Label: `Shipper:`
- View Button: `View Details` / `Hide Details`

### Order Details (Expanded)
- `Order Items:` (section heading)
- Format: `{item.name} x{item.quantity}` with price
- `Shipping Address:` (section heading)

---

## 16. NOT FOUND PAGE (404)
**File:** `src/app/pages/NotFound.tsx`

- Error Code: `404`
- Heading: `Page Not Found`
- Message: `The page you're looking for doesn't exist.`
- Button: `Go Home`

---

## 17. ADMIN DASHBOARD
**File:** `src/app/pages/admin/AdminDashboard.tsx`

### Page Header
- `Dashboard Overview`

### Dashboard Cards (4 total)
1. Title: `Total Users` | Icon: Users
2. Title: `Total Products` | Icon: Package
3. Title: `Total Orders` | Icon: ShoppingBag
4. Title: `Revenue` | Icon: DollarSign

### Welcome Section
- Heading: `Welcome to Admin Panel`
- Message: `Use the sidebar to navigate between different management sections. You can manage users, products, and orders from here.`

---

## 18. MANAGE PRODUCTS PAGE
**File:** `src/app/pages/admin/ManageProducts.tsx`

### Page Header
- Heading: `Manage Products`
- Subtitle: `Total Products: {count}`
- Button: `Add Product`

### Product Card Elements
- Edit Button: `Edit`
- Delete Button: `Delete`
- Status Display: `in-stock`, `out-of-stock`, `coming-soon`

### Empty State
- Message: `No products yet. Add your first product!`
- Button: `Add First Product`

### Add/Edit Form Modal
- Modal Title: `Add New Product` / `Edit Product`
- Form Fields:
  - Label: `Product Name`
  - Label: `Description`
  - Label: `Price`
  - Label: `Stock`
  - Label: `Category`
    - Options: `Ovens`, `Refrigerators`, `Dishwashers`, `Microwaves`, `Cooker Hoods`
  - Label: `Status`
    - Options: `In Stock`, `Out of Stock`, `Coming Soon`
  - Label: `Image URL`
  - Placeholder: `https://...`
- Buttons: `Cancel` | `Add Product` / `Update Product`

### Pagination Controls
- `Previous`
- Page Numbers
- `Next`

### Toast Messages
- `Product added successfully`
- `Product updated successfully`
- `Product deleted successfully`

---

## 19. MANAGE ORDERS PAGE
**File:** `src/app/pages/admin/ManageOrders.tsx`

### Page Header
- `Manage Orders`

### Empty State
- `No orders yet`

### Order Details Display
- `Order ID` (label)
- `Date` (label)
- `Customer` (label)
- `Total` (label)
- `Order Items:` (section heading)
- `Shipping Details:` (section heading)
  - `Payment:` label
  - `Shipper:` label
  - `QR Code / Banking` (payment method)
  - `Cash on Delivery` (payment method)
- Status Badge Display

---

## 20. MANAGE USERS PAGE
**File:** `src/app/pages/admin/ManageUsers.tsx`

### Page Header
- Heading: `Manage Users`
- Button: `Add User`

### Table Headers
- `Username`
- `Email`
- `Role`
- `Status`
- `Actions`

### Role Badges
- `admin` (text)
- `user` (text)

### Status Badge
- `active` (text)

### Action Buttons
- Edit Button (Icon only)
- Delete Button (Icon only)

### Edit Modal
- Modal Title: `Edit User`
- Form Fields:
  - Label: `Username`
  - Label: `Email`
  - Label: `Role`
    - Options: `User`, `Admin`
- Buttons: `Cancel` | `Save`

### Toast Messages
- `Cannot delete admin account`
- `User deleted successfully`
- `User updated successfully`

---

## 21. PRODUCT DATA
**File:** `src/app/data/products.ts`

### Product Names
1. `Premium Electric Oven`
2. `Smart Refrigerator`
3. `Eco Dishwasher`
4. `Microwave Oven Pro`
5. `Designer Cooker Hood`
6. `Built-in Oven Deluxe`

### Product Badges
- `Bestseller`
- `New`
- `Premium`

### Product Descriptions
1. `Advanced convection technology with precision temperature control. Features 10 cooking modes, self-cleaning function, and energy-efficient design.`
2. `WiFi-enabled smart refrigerator with touchscreen display. Temperature zones, built-in camera, and mobile app control.`
3. `Energy-efficient dishwasher with 6 wash programs. Ultra-quiet operation and advanced water filtration system.`
4. `1200W microwave with convection cooking. Smart sensor technology and 15 preset cooking programs.`
5. `Sleek stainless steel design with powerful extraction. LED lighting and touch controls.`
6. `Professional-grade built-in oven with dual fan system. Steam cooking and rapid preheat function.`

---

## 22. GENERAL UI ELEMENTS & LABELS

### Common Button Labels
- `Submit`
- `Cancel`
- `Save`
- `Delete`
- `Edit`
- `Add`
- `Update`
- `View`
- `Hide`
- `Shop Now`
- `Shop Sale`
- `Continue Shopping`
- `Proceed to Checkout`

### Common Status Labels
- `pending` (order status)
- `active` (user status)
- `admin` (user role)
- `user` (user role)
- `in-stock`
- `out-of-stock`
- `coming-soon`

### Common Error Messages
- `An error occurred. Please try again.`
- `Please login to add items to cart`
- `Please login to continue`

### Common Success Messages
- `Login successful!`
- `Account created successfully!`
- `Order placed successfully!`

---

## 23. FORM VALIDATION MESSAGES

### General Validation
- `{Field Name} is required`
- `Invalid {Field Name}`
- `{Field Name} must be at least X characters`
- `{Field Names} do not match`

### Specific Examples
- `Username is required`
- `Email is required`
- `Password is required`
- `Full name is required`
- `Phone number is required`
- `Address is required`
- `Username must be at least 3 characters`
- `Password must be at least 3 characters`
- `Invalid email format`
- `Passwords do not match`

---

## 24. HEADER MOBILE MENU
**File:** `src/app/components/Header.tsx`

### Mobile Menu Items
- Same as desktop navigation links:
  - `Home`
  - `Products`
  - `Categories`
  - `About`
  - `Contact`
  - `Admin` (for admin users)

---

## SUMMARY STATISTICS

| Category | Count |
|----------|-------|
| Component Files | 8 |
| Page Files | 9 |
| Admin Pages | 3 |
| Data Files | 1 |
| **Total User-Facing Strings** | **250+** |

## Notes for Translators

1. **Brand Name**: "KitchenPro" - Consider whether this should be translated or kept as-is.
2. **Product Categories**: Consider consistency in how these are translated across the site.
3. **Technical Terms**: Some terms like "Smart Technology", "WiFi-enabled", etc. may have preferred Vietnamese translations.
4. **Tone**: Maintain professional yet friendly tone throughout.
5. **Formatting**: Preserve all HTML tags, icons, and formatting in translations.
6. **URLs & Contact Info**: Email addresses, phone numbers, and sample addresses may not need translation in some contexts.

---

## Implementation Recommendations

1. Consider using a translation management system (i18n/i18next for React)
2. Create a separate translation file structure in `src/locales/vi/` or similar
3. Create translation key constants to avoid hardcoding strings in components
4. Set up automated testing for missing translations
5. Consider implementing language switcher UI component

