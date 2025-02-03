import { renderAuthButton } from "./utils/utils.js";
renderAuthButton();
async function fetchCart() {
  const token = localStorage.getItem("token");

  const shopLink = document.getElementById("shop-link");

  if (!token) {
    shopLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "login.html";
    });
  }

  const sideMenu = document.getElementById("side-menu");
  const menuBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".close-btn");
  menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

  try {
    const response = await fetch("http://localhost:3000/api/v1/carts/cart/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok && data.cart[0].items) {
      const watchDataPromises = data.cart[0].items.map(async (cartItem) => {
        const watchData = await getWatchById(cartItem.watchId);
        return {
          watchData,
          cartItemId: cartItem._id,
          quantity: cartItem.quantity || 1,
        };
      });

      const watchItems = await Promise.all(watchDataPromises);
      const totalItems = watchItems.length;
      const totalPrice = watchItems.reduce(
        (sum, item) => sum + item.watchData.price * item.quantity,
        0
      );

      updateCartDisplay(watchItems);
    } else {
      console.error("Error fetching cart items:", data.message);
      alert("Failed to fetch cart items.");
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    alert("An error occurred while fetching your cart.");
  }
}

async function getWatchById(watchId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/watches/${watchId}`
    );
    const watchData = await response.json();
    if (response.ok) {
      return watchData;
    } else {
      console.error("Failed to fetch watch data:", watchData.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching watch data:", error);
    return null;
  }
}

function updateCartDisplay(cartItems) {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const placeOrderButton = document.getElementById("place-order-btn");
  const totalItemsElement = document.getElementById("total-items");
  const summaryTotalPriceElement = document.getElementById(
    "summary-total-price"
  );

  cartContainer.innerHTML = "";
  let totalItems = 0;
  let totalPrice = 0;

  cartItems.forEach((item) => {
    if (!item || !item.watchData) return;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");

    const itemImg = document.createElement("img");
    itemImg.classList.add("cart-item-img");
    itemImg.src = item.watchData.watchImage;
    itemImg.alt = item.watchData.name;
    itemImg.crossOrigin = "anonymous";

    const itemDetails = document.createElement("div");
    itemDetails.classList.add("cart-item-details");

    const itemName = document.createElement("h3");
    itemName.classList.add("cart-item-name");
    itemName.innerText = item.watchData.name;

    const itemPrice = document.createElement("p");
    itemPrice.classList.add("cart-item-price");

    const price = parseFloat(item.watchData.price);
    itemPrice.innerText = `₱${price.toLocaleString()}`;

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.classList.add("quantity-input");
    quantityInput.value = item.quantity || 1;
    quantityInput.min = 1;
    quantityInput.addEventListener("input", () => {
      updateCartItemQuantity(item.cartItemId, quantityInput.value);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.innerText = "Remove";
    removeButton.onclick = () => removeCartItem(item.cartItemId);
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPrice);
    itemDetails.appendChild(quantityInput);
    itemDetails.appendChild(removeButton);

    cartItemDiv.appendChild(itemImg);
    cartItemDiv.appendChild(itemDetails);

    cartContainer.appendChild(cartItemDiv);

    const itemQuantity = item.quantity || 1;
    totalPrice += price * itemQuantity;
    totalItems += itemQuantity;
  });

  totalPriceElement.innerText = `₱${totalPrice.toLocaleString()}`;

  totalItemsElement.innerText = totalItems.toLocaleString();
  summaryTotalPriceElement.innerText = `₱${totalPrice.toLocaleString()}`;

  placeOrderButton.disabled = cartItems.length === 0;
  placeOrderButton.style.opacity = cartItems.length === 0 ? "0.5" : "1";
}

async function addToCart(watchId, name, img, price, quantity = 1) {
  console.log(watchId, name, img, price, quantity);

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.watchId === watchId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem = { watchId, quantity, name, img, price };
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Item added to cart:", cart);

    const cartData = { watchId, quantity, name, img, price };
    const response = await fetch(
      "http://localhost:3000/api/v1/carts/cart/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming authToken is stored in localStorage
        },
        body: JSON.stringify(cartData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Item added to cart successfully!");
    } else {
      console.error("Failed to add item to cart:", data.message);
    }

    updateCartCount();
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

async function updateCartItemQuantity(itemId, quantity) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to update cart items.");
    return;
  }

  const body = {
    itemId: itemId,
    quantity: parseInt(quantity),
  };

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/carts/cart/items`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log("Item quantity updated.");
      fetchCart();
    } else {
      console.error("Failed to update item quantity:", data.message);
      alert("Failed to update item quantity.");
    }
  } catch (error) {
    console.error("Error updating item quantity:", error);
    alert("An error occurred while updating the item quantity.");
  }
}

async function removeCartItem(cartItemId) {
  const token = localStorage.getItem("token");
  console.log(cartItemId);
  if (!token) {
    alert("Please log in to remove items from your cart.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/carts/cart/items/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (response.ok) {
      alert("Item removed from cart.");
      fetchCart();
    } else {
      console.error("Failed to remove item from cart:", data.message);
      alert("Failed to remove item from the cart.");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    alert("An error occurred while removing the item from the cart.");
  }
}

window.onload = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }
  renderAuthButton();
  fetchCart();
};
