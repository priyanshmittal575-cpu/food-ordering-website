const menuItems = [
  { id: 1, name: "Paneer Tikka Roll", category: "Meals", price: 95, desc: "Grilled paneer wrapped in whole-wheat paratha with mint chutney." },
  { id: 2, name: "Masala Dosa & Sambar", category: "Meals", price: 80, desc: "Crispy South Indian crepe served with coconut chutney." },
  { id: 3, name: "Veg Hakka Noodles", category: "Meals", price: 110, desc: "Stir-fried noodles tossed with fresh bell peppers and soy." },
  { id: 4, name: "Samosa Plate (2 Pcs)", category: "Snacks", price: 35, desc: "Hot potato-filled samosas with tamarind sauce." },
  { id: 5, name: "Cheese Grilled Sandwich", category: "Snacks", price: 65, desc: "Toasted triple-layer veggie and mozzarella sandwich." },
  { id: 6, name: "Cold Coffee", category: "Drinks", price: 60, desc: "Chilled blended coffee topped with cocoa." },
  { id: 7, name: "Fresh Lime Soda", category: "Drinks", price: 40, desc: "Refreshing sweet and salted lemon soda." }
];

let cart = {};
let activeCategory = "All";

const menuGrid = document.getElementById("menuGrid");
const cartItemsEl = document.getElementById("cartItems");
const checkoutBtn = document.getElementById("checkoutBtn");
const orderSuccess = document.getElementById("orderSuccess");

function renderMenu() {
  menuGrid.innerHTML = "";
  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <div>
        <span class="food-cat">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div class="card-bottom">
        <span class="price">₹${item.price}</span>
        <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

function addToCart(id) {
  orderSuccess.classList.add("hidden");
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQty(id, delta) {
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const ids = Object.keys(cart);
  cartItemsEl.innerHTML = "";

  if (ids.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty">Your cart is empty.</p>`;
    document.getElementById("cartCount").textContent = "0";
    document.getElementById("subtotal").textContent = "₹0";
    document.getElementById("packFee").textContent = "₹0";
    document.getElementById("grandTotal").textContent = "₹0";
    checkoutBtn.disabled = true;
    return;
  }

  let totalItems = 0;
  let subtotal = 0;

  ids.forEach((id) => {
    const item = menuItems.find((m) => m.id === Number(id));
    const qty = cart[id];
    totalItems += qty;
    subtotal += item.price * qty;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br />
        <small>₹${item.price} × ${qty}</small>
      </div>
      <div class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  const packFee = 15;
  document.getElementById("cartCount").textContent = totalItems;
  document.getElementById("subtotal").textContent = `₹${subtotal}`;
  document.getElementById("packFee").textContent = `₹${packFee}`;
  document.getElementById("grandTotal").textContent = `₹${subtotal + packFee}`;
  checkoutBtn.disabled = false;
}

document.getElementById("categoryTabs").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  document.querySelectorAll("#categoryTabs button").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  activeCategory = e.target.dataset.cat;
  renderMenu();
});

checkoutBtn.addEventListener("click", () => {
  const token = Math.floor(100 + Math.random() * 900);
  cart = {};
  renderCart();
  orderSuccess.textContent = `Order placed! Show Token #${token} at the canteen counter.`;
  orderSuccess.classList.remove("hidden");
});

renderMenu();