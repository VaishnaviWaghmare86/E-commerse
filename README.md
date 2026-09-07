# 🧸 Kids E-Commerce Platform (Connected Fullstack)

A unified e-commerce platform combining customer storefront, administration dashboard, and backend REST API.

---

## 🏗️ Architecture & Services

| Service | Directory | Tech Stack | Port | Description |
|---|---|---|---|---|
| **Website (Storefront)** | `frontend/` | Next.js 16 (App Router), Tailwind CSS | `3000` | Customer shopping experience, dynamic product catalog, cart, and wishlist |
| **Admin Dashboard** | `admin/` | Vite + React 19, Tailwind CSS | `5173` | Management portal for products, categories, orders, banners, and store settings |
| **Backend API** | `backend/` | Node.js, Express, Prisma / Resilient Store | `5000` | Shared REST API providing product, category, banner, and order endpoints |

---

## 🚀 Quick Start (Single Command)

From the project root (`d:/E-Commerse Website/E-commerse` or `d:/E-Commerse Website`):

```bash
npm run dev
```

This starts all three services concurrently with labeled, color-coded output:
- **Customer Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:5173](http://localhost:5173) *(or [http://localhost:3000/admin](http://localhost:3000/admin))*
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### Run Individual Services
- **Storefront only**: `npm run dev:frontend`
- **Admin only**: `npm run dev:admin`
- **Backend only**: `npm run dev:backend`

---

## 🔗 How They Are Connected

1. **Direct Navigation**:
   - **From Website to Admin**:
     - Top dark bar has an **Admin Panel** quick link.
     - Header icons area features an **Admin** shortcut button.
     - Footer contains an **Admin Portal ↗** link under Quick Links.
     - Navigating to `/admin` on the website automatically redirects to the admin panel.
   - **From Admin to Website**:
     - Admin header bar features a prominent **View Store** button that opens `http://localhost:3000`.

2. **Shared Data & Real-Time Sync**:
   - Products added or edited in the Admin Dashboard (`/admin/products/new`) are saved via the backend API (`/api/products`).
   - The Storefront's Shop (`/shop`), Home (`/`), and New Arrivals (`/new`) pages fetch live data from the backend API.
   - Any updates made in the admin panel immediately reflect on the website catalog.

3. **Zero-Config Database Resilience**:
   - If PostgreSQL is available, Prisma connects to PostgreSQL.
   - If PostgreSQL is offline, the backend seamlessly falls back to a persistent JSON datastore (`backend/data/store.json`) pre-populated with rich sample products and categories.
   - Zero crashes or database configuration hurdles when running locally!
