# E-Commerce Portal — Admin & Client

- This project is a lightweight, browser-based e-commerce portal built with HTML, CSS, and JavaScript for the frontend and Express.js for the backend API.
- It provides separate interfaces for Admin and Client users, enabling basic product management, cart functionality, and order processing.
- Data such as products and orders is persisted on the server in JSON files, while user sessions and carts are managed via the browser’s localStorage.

## Features

### Admin Panel
- Login: Admin authenticates with predefined credentials.
- Add Products: Create new products with name, price, category, description, and optional image URL.
- View Products: List all products with details and creation dates.
- Delete Products: Remove products by ID from the inventory.
- View Orders: View all client orders, including items, totals, user info, and timestamps.

### Client Panel
- Register: Create a new client account (stored in browser localStorage).
- Login: Client logs in to access shopping features.
- View Products: Browse available products fetched from the backend.
- Add to Cart: Add items to a personal cart stored in localStorage.
- View Cart: Inspect selected items, quantities, and total price.
- Delete Cart Items: Remove specific products from the cart.
- Place Order: Send cart data to the backend, generating a persistent order record.

## Technologies Used
- HTML5 & CSS3 — UI structure and styling.
- Vanilla JavaScript — Frontend logic for both Admin and Client modules.
- LocalStorage — Persistent client-side storage for user sessions and carts.
- Node.js + Express.js — Backend REST API for products and orders.
- JSON Files — Lightweight server-side persistence for products and orders.

## How to run
1. Install dependencies
```bash
npm install
```

2. Start the server
```bash
npm start
```

3. Open in browser
- Navigate to: http://localhost:5000
- Use the landing page to access Admin or Client modules.

## Demo Admin Credentials
```txt
Username: admin
Password: admin123
```

## Notes
- Persistence:
    - Products & orders are stored in backend JSON files (backend/data/).
    - Client accounts and cart are stored in browser localStorage for demo simplicity.
- This is a learning/demo project and not production-ready. For a real system, replace JSON/LocalStorage with a secure database and proper authentication.