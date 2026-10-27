const products = [
  { id: 1, name: "Headphones", category: "Electronics", price: 5999.99 },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 6000.5 },
  { id: 3, name: "Keyboard", category: "Electronics", price: 3000.0 },
  { id: 4, name: "T-Shirt", category: "Clothing", price: 1000.0 },
  { id: 5, name: "Jeans", category: "Clothing", price: 2000.0 },
  { id: 6, name: "Jacket", category: "Clothing", price: 3500.99 },
  { id: 7, name: "JavaScript Book", category: "Books", price: 750.0 },
  { id: 8, name: "Novel", category: "Books", price: 1250.5 }
];

let cart = [];

const COUPON_CODE = "SAVE10";
const COUPON_DISCOUNT = 0.1;
let couponApplied = false;

const productList = document.getElementById("product-list");
const categoryFilter = document.getElementById("category-filter");
const priceSort = document.getElementById("price-sort");
const cartItemsDiv = document.getElementById("cart-items");
const couponInput = document.getElementById("coupon-input");
const applyCouponBtn = document.getElementById("apply-coupon-btn");
const couponMessage = document.getElementById("coupon-message");
const subtotalSpan = document.getElementById("subtotal");
const discountSpan = document.getElementById("discount");
const totalSpan = document.getElementById("total");
const placeOrderBtn = document.getElementById("place-order-btn");
const orderMessage = document.getElementById("order-message");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartCount = document.getElementById("cart-count");

function formatPrice(amount) {
  return "₹" + amount.toFixed(2);
}

function showProducts() {
  const selectedCategory = categoryFilter.value;
  const selectedSort = priceSort.value;

  let visibleProducts = products.filter(function (product) {
    return selectedCategory === "All" || product.category === selectedCategory;
  });

  if (selectedSort === "low-high") {
    visibleProducts.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (selectedSort === "high-low") {
    visibleProducts.sort(function (a, b) {
      return b.price - a.price;
    });
  }

  productList.innerHTML = "";
  visibleProducts.forEach(function (product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const cartItem = cart.find(function (item) {
      return item.id === product.id;
    });

    let actionHtml;
    if (cartItem) {
      actionHtml =
        "<div class='quantity-row'>" +
          "<button class='qty-btn decrease-btn' data-id='" + product.id + "'>-</button>" +
          "<span>" + cartItem.quantity + "</span>" +
          "<button class='qty-btn increase-btn' data-id='" + product.id + "'>+</button>" +
        "</div>";
    } else {
      actionHtml = "<button class='add-btn' data-id='" + product.id + "'>Add to Cart</button>";
    }

    card.innerHTML =
      "<h3>" + product.name + "</h3>" +
      "<p class='category'>" + product.category + "</p>" +
      "<p class='price'>" + formatPrice(product.price) + "</p>" +
      actionHtml;
    productList.appendChild(card);
  });
}

function addToCart(productId) {
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = products.find(function (p) {
      return p.id === productId;
    });
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  orderMessage.textContent = "";
  showCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  showCart();
}

function updateQuantity(productId, change) {
  const item = cart.find(function (cartItem) {
    return cartItem.id === productId;
  });

  const newQuantity = item.quantity + change;
  if (newQuantity >= 1) {
    item.quantity = newQuantity;
  }
  showCart();
}

function calculateSubtotal() {
  let subtotal = 0;
  cart.forEach(function (item) {
    subtotal += item.price * item.quantity;
  });
  return subtotal;
}

function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase();

  if (code === COUPON_CODE) {
    couponApplied = true;
    couponMessage.textContent = "Coupon applied: 10% off!";
    couponMessage.className = "message success";
  } else {
    couponApplied = false;
    couponMessage.textContent = "Invalid coupon code.";
    couponMessage.className = "message error";
  }
  showCart();
}

function calculateDiscount(subtotal) {
  if (couponApplied) {
    return subtotal * COUPON_DISCOUNT;
  }
  return 0;
}

function placeOrder() {
  if (cart.length === 0) {
    orderMessage.textContent = "Your cart is empty. Add some products first.";
    orderMessage.className = "message error";
    return;
  }

  const subtotal = calculateSubtotal();
  const finalTotal = subtotal - calculateDiscount(subtotal);

  cart = [];
  couponApplied = false;
  couponInput.value = "";
  couponMessage.textContent = "";
  showCart();

  orderMessage.textContent =
    "Order placed successfully! Total paid: " + formatPrice(finalTotal) + ". Thank you!";
  orderMessage.className = "message success";
}

function showCart() {
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
  }

  cart.forEach(function (item) {
    const itemSubtotal = item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML =
      "<p class='cart-item-name'>" + item.name + "</p>" +
      "<p>" + formatPrice(item.price) + " each</p>" +
      "<div class='quantity-row'>" +
        "<button class='qty-btn decrease-btn' data-id='" + item.id + "'>-</button>" +
        "<span>" + item.quantity + "</span>" +
        "<button class='qty-btn increase-btn' data-id='" + item.id + "'>+</button>" +
      "</div>" +
      "<p>Subtotal: " + formatPrice(itemSubtotal) + "</p>" +
      "<button class='remove-btn' data-id='" + item.id + "'>Remove</button>";
    cartItemsDiv.appendChild(row);
  });

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;

  subtotalSpan.textContent = formatPrice(subtotal);
  discountSpan.textContent = "-" + formatPrice(discount);
  totalSpan.textContent = formatPrice(total);

  let itemCount = 0;
  cart.forEach(function (item) {
    itemCount += item.quantity;
  });
  cartCount.textContent = itemCount;

  showProducts();
}

categoryFilter.addEventListener("change", showProducts);
priceSort.addEventListener("change", showProducts);

productList.addEventListener("click", function (event) {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("add-btn")) {
    addToCart(id);
  } else if (event.target.classList.contains("increase-btn")) {
    updateQuantity(id, 1);
  } else if (event.target.classList.contains("decrease-btn")) {
    updateQuantity(id, -1);
  }
});

cartItemsDiv.addEventListener("click", function (event) {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("increase-btn")) {
    updateQuantity(id, 1);
  } else if (event.target.classList.contains("decrease-btn")) {
    updateQuantity(id, -1);
  } else if (event.target.classList.contains("remove-btn")) {
    removeFromCart(id);
  }
});

applyCouponBtn.addEventListener("click", applyCoupon);
placeOrderBtn.addEventListener("click", placeOrder);

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
}

cartToggleBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCart();
  }
});

showProducts();
showCart();