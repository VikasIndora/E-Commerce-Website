const API = "http://localhost:5000";

function saveAdminToken(t) {
    localStorage.setItem("adminToken", t);
}
function getAdminToken() {
    return localStorage.getItem("adminToken");
}
function clearAdmin() {
    localStorage.removeItem("adminToken");
}

async function adminLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
        const data = await res.json();
        saveAdminToken(data.token);
        window.location.href = "products.html";
    } else {
        alert("Invalid credentials");
    }
}

async function fetchProducts() {
    const res = await fetch(`${API}/products`);
    return await res.json();
}

async function addProduct(e) {
    e.preventDefault();
    const token = getAdminToken();
    const body = {
        name: document.getElementById("pname").value.trim(),
        price: document.getElementById("pprice").value.trim(),
        imageUrl: document.getElementById("pimage").value.trim(),
        description: document.getElementById("pdesc").value.trim(),
        category: document.getElementById("pcat").value.trim(),
    };
    const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(body),
    });
    if (res.ok) {
        alert("Product added");
        location.reload();
    } else {
        alert("Failed to add product");
    }
}

async function deleteProduct(id) {
    const token = getAdminToken();
    const ok = confirm("Delete this product?");
    if (!ok) return;
    const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
    });
    if (res.ok) {
        alert("Deleted");
        location.reload();
    } else {
        alert("Failed to delete");
    }
}

async function loadOrders() {
    const token = getAdminToken();
    const res = await fetch(`${API}/orders`, {
        headers: { "x-admin-token": token },
    });
    if (!res.ok) {
        alert("Unauthorized. Please login again.");
        window.location.href = "login.html";
        return;
    }
    const orders = await res.json();
    const tbody = document.querySelector("#ordersBody");
    tbody.innerHTML = "";
    orders.reverse().forEach((o) => {
        const tr = document.createElement("tr");
        const items = o.items
            .map((it) => `${it.name} (x${it.qty || 1})`)
            .join(", ");
        tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.user?.name || "Guest"}<div class="small">${
            o.user?.email || ""
        }</div></td>
      <td>${items}</td>
      <td>₹${o.total}</td>
      <td><span class="badge">${o.status}</span></td>
      <td>${new Date(o.createdAt).toLocaleString()}</td>
    `;
        tbody.appendChild(tr);
    });
}
