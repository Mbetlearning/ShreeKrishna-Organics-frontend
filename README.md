# Prakriti Oils — Premium Indian Cooking-Oil E-Commerce Frontend

A modern, responsive, and elegant e-commerce frontend demo for **Prakriti Oils** — an authentic Indian cold and traditional wood-pressed (*Vaagai Marachekku / Ghani*) cooking oil brand.

Built specifically to look professional for client demonstrations while keeping the code **clean, simple, beginner-friendly, and pre-configured for connection to a Java Spring Boot REST backend**.

---

## 🛠️ Tech Stack

- **Framework**: React 18 / Vite
- **Routing**: React Router v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 (Vanilla CSS tokens + utility classes)
- **Icons**: Lucide React
- **State Management**: Clean React Context & LocalStorage persistence (No Redux, no Zustand, no complex state management)
- **Language**: JavaScript (ES6+)

---

## 📁 Project Structure

```
prakriti-oils-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Responsive navbar with search, cart badge, mobile drawer
│   │   ├── Footer.jsx           # Trust badges, links, newsletter, social & contact
│   │   ├── ProductCard.jsx      # Reusable card with dynamic size selector & quick Add-to-Cart
│   │   ├── ProductGrid.jsx      # Grid layout with empty/filtered states
│   │   ├── RazorpayModal.jsx    # Mock Razorpay checkout popup with Spring Boot notes
│   │   ├── SectionHeader.jsx    # Reusable section header with typography hierarchy
│   │   ├── Button.jsx           # Reusable button with variants
│   │   └── LoadingSpinner.jsx   # Clean loading indicator
│   ├── context/
│   │   ├── CartContext.jsx      # Cart state + LocalStorage sync + calculations
│   │   ├── AuthContext.jsx      # Demo auth state (user, login, register, logout)
│   │   └── ToastContext.jsx     # Floating toast notifications
│   ├── data/
│   │   ├── products.js          # Centralized product catalog (8+ realistic items)
│   │   └── testimonials.js      # Customer reviews, categories and brand stats
│   ├── pages/
│   │   ├── Home.jsx             # Hero, Philosophy, Featured, Benefits, Process, Story, Trust, Reviews
│   │   ├── Shop.jsx             # Product catalog with search, category tabs, sort, filters
│   │   ├── ProductDetails.jsx   # Gallery, size selector, accordion specs, related products
│   │   ├── Cart.jsx             # Interactive cart items, free shipping meter, promo code, subtotal
│   │   ├── Checkout.jsx         # Customer info, shipping form, order summary, Razorpay modal
│   │   ├── Login.jsx            # User sign-in with demo credential autofill
│   │   ├── Register.jsx         # New customer sign-up
│   │   ├── Orders.jsx           # Customer order history with tracking timeline & items
│   │   ├── About.jsx            # Farm story, extraction comparison (Wood pressed vs Refined)
│   │   ├── Contact.jsx          # Inquiry form, office address, customer support & FAQ
│   │   └── NotFound.jsx         # Friendly 404 page
│   ├── services/
│   │   ├── api.js               # Central HTTP wrapper & Spring Boot base URL
│   │   ├── productService.js    # Product queries (mocked, ready for /api/products)
│   │   ├── authService.js       # Auth queries (mocked, ready for /api/auth/*)
│   │   ├── orderService.js      # Order queries (mocked, ready for /api/orders/*)
│   │   └── paymentService.js    # Payment queries (mocked, ready for /api/payment/*)
│   ├── App.jsx                  # Main router setup & layout wrapping
│   ├── main.jsx                 # React root render
│   └── index.css                # Tailwind directives & custom design tokens
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` or `http://127.0.0.1:5173/`.

### 3. Production Build
```bash
npm run build
```

---

## 🌿 Demo Showcase Cheat Sheet

- **Demo User Login**: Click the **Autofill** button on `/login` or enter `priya.s@example.com` / `password123`.
- **Promo Coupon Codes**:
  - `PRAKRITI10` — 10% Welcome Discount
  - `PUREOIL` — 15% Festive Harvest Offer
- **Free Shipping Threshold**: Orders ≥ ₹999 qualify for Free Express Shipping across India (standard delivery is ₹49 below ₹999).
- **Payment Demo**: Choose "Pay Online with Razorpay" at Checkout and click **"Simulate Successful Payment"** to test complete order placement and live tracking updates.

---

## ☕ Spring Boot REST API Integration Guide

When your Java Spring Boot backend is ready, follow these simple steps to replace the mock data with live REST endpoints:

### Step 1: Update API Base URL
In `src/services/api.js`:
```javascript
const BASE_URL = 'http://localhost:8080/api';
```

### Step 2: Spring Boot Controller Endpoints
| Feature | Frontend Service | Suggested Spring Boot Controller Endpoint |
|---|---|---|
| **Auth - Login** | `authService.login()` | `POST /api/auth/login` (Returns JWT Token & User Profile) |
| **Auth - Register** | `authService.register()` | `POST /api/auth/register` |
| **Auth - Current User** | `authService.getCurrentUser()` | `GET /api/auth/me` |
| **Products - List** | `productService.getAllProducts()` | `GET /api/products?category=x&search=y&sort=z` |
| **Products - Detail** | `productService.getProductBySlug()` | `GET /api/products/slug/{slug}` |
| **Orders - Create** | `orderService.createOrder()` | `POST /api/orders` |
| **Orders - History** | `orderService.getUserOrders()` | `GET /api/orders/my-orders` |
| **Payment - Create Order** | `paymentService.createRazorpayOrder()` | `POST /api/payment/create-order` (Razorpay Java SDK) |
| **Payment - Verify** | `paymentService.verifyPayment()` | `POST /api/payment/verify` (HMAC SHA256 Verification) |

---

## ✨ Design Features & Highlights

1. **Brand Aesthetic**: Warm sand/cream background (`#FAF7F2`), deep heritage forest green (`#1E3A2B`), warm amber gold (`#C88A2C`), and terracotta accents.
2. **Typography**: Google Fonts `Playfair Display` & `Cinzel` for editorial headings paired with `Plus Jakarta Sans` for ultra-clean UI readability.
3. **Interactive Cart**: Dynamic quantity updating, coupon discounts, free delivery progress meter, and responsive drawer.
4. **Order Tracking**: Visual step-by-step progress tracker (*Order Placed* → *Cold-Pressed* → *Dispatched* → *Delivered*).
5. **No Unsupported Medical Claims**: Focuses strictly on traditional low-heat extraction, single-origin sourcing, unrefined purity, and smoke points.
