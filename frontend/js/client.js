const API = "http://localhost:5000";

function saveUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}
function getUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
        return null;
    }
}
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
        return [];
    }
}
function setCart(c) {
    localStorage.setItem("cart", JSON.stringify(c));
}
function clearCart() {
    localStorage.removeItem("cart");
}

// Register
function register(e) {
    e.preventDefault();
    const name = document.getElementById("rname").value.trim();
    const email = document.getElementById("remail").value.trim();
    const password = document.getElementById("rpassword").value.trim();
    if (!name || !email || !password) return alert("All fields required");
    // Save to localStorage "users"
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email))
        return alert("Email already registered");
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered! Please login.");
    window.location.href = "login.html";
}

// Login
function login(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
        (u) => u.email === email && u.password === password
    );
    if (!user) return alert("Invalid credentials");
    saveUser({ name: user.name, email: user.email });
    window.location.href = "products.html";
}

// Products
async function loadProducts() {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    data.forEach((p) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <img src="${p.imageUrl || "https://via.placeholder.com/300x200"}" alt="${
            p.name
        }" />
      <h3>${p.name}</h3>
      <div class="small">${p.category}</div>
      <p>₹${p.price}</p>
      <button class="btn btn-primary" onclick='addToCart(${JSON.stringify({
          id: p.id,
          name: p.name,
          price: p.price,
      }).replace(/'/g, "&#39;")})'>Add to Cart</button>
    `;
        grid.appendChild(card);
    });
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    setCart(cart);
    alert("Added to cart");
}

// Cart page
function renderCart() {
    const cart = getCart();
    const tbody = document.getElementById("cartBody");
    const totalEl = document.getElementById("cartTotal");
    tbody.innerHTML = "";
    let total = 0;
    cart.forEach((it, idx) => {
        const line = (it.qty || 1) * Number(it.price || 0);
        total += line;
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${it.name}</td>
      <td>₹${it.price}</td>
      <td>${it.qty || 1}</td>
      <td>₹${line}</td>
      <td><button class="btn btn-danger" onclick="removeFromCart(${idx})">Remove</button></td>
    `;
        tbody.appendChild(tr);
    });
    totalEl.textContent = `₹${total}`;
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
    renderCart();
}

function deleteCart() {
    const ok = confirm("Clear entire cart?");
    if (!ok) return;
    clearCart();
    renderCart();
}

async function placeOrder() {
    const user = getUser();
    const cart = getCart();
    if (cart.length === 0) return alert("Cart is empty");
    let total = 0;
    cart.forEach((it) => (total += (it.qty || 1) * Number(it.price || 0)));
    const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total, user }),
    });
    if (res.ok) {
        const order = await res.json();
        clearCart();
        alert("Order placed! ID: " + order.id);
        window.location.href = "products.html";
    } else {
        alert("Failed to place order");
    }
}
