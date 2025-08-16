const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve project root (for index.html) and frontend folder
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Data files
const productsFile = path.join(__dirname, "data", "products.json");
const ordersFile = path.join(__dirname, "data", "orders.json");

// Ensure data files exist
function ensureFile(file, fallbackData) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallbackData, null, 2));
  }
}
ensureFile(productsFile, []);
ensureFile(ordersFile, []);

// Helper to read/write JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- Admin Auth ---
const ADMIN_USER = { username: "admin", password: "admin123" };
const ADMIN_TOKEN = "admintoken-123"; // static token

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    return res.json({ token: ADMIN_TOKEN, username });
  }
  return res.status(401).json({ message: "Invalid admin credentials" });
});

function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token");
  if (token === ADMIN_TOKEN) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// --- Products ---
// Public: view products
app.get("/products", (req, res) => {
  const products = readJSON(productsFile);
  res.json(products);
});

// Admin: add product
app.post("/products", requireAdmin, (req, res) => {
  const products = readJSON(productsFile);
  const { name, price, imageUrl, description, category } = req.body || {};
  if (!name || price == null) {
    return res.status(400).json({ message: "name and price are required" });
  }
  const product = {
    id: Date.now(),
    name,
    price: Number(price),
    imageUrl: imageUrl || "",
    description: description || "",
    category: category || "General",
    createdAt: new Date().toISOString()
  };
  products.push(product);
  writeJSON(productsFile, products);
  res.status(201).json(product);
});

// Admin: delete product
app.delete("/products/:id", requireAdmin, (req, res) => {
  const id = req.params.id;
  const products = readJSON(productsFile);
  const next = products.filter(p => String(p.id) !== String(id));
  writeJSON(productsFile, next);
  res.json({ message: "Product deleted", id });
});

// --- Orders ---
// Client: place order
app.post("/orders", (req, res) => {
  const orders = readJSON(ordersFile);
  const { items, total, user } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must include items" });
  }
  const order = {
    id: Date.now(),
    items,
    total: Number(total || 0),
    user: user || null,
    status: "PLACED",
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  writeJSON(ordersFile, orders);
  res.status(201).json(order);
});

// Admin: view orders
app.get("/orders", requireAdmin, (req, res) => {
  const orders = readJSON(ordersFile);
  res.json(orders);
});

// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
