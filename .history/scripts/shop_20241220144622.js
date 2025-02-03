// Fetching watches from the backend API
async function fetchWatches() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/watches"); // Replace with your backend endpoint
    const data = await response.json();

    if (response.ok && data && Array.isArray(data.watches)) {
      console.log("Got the watches", data.watches);

      // Fetch cart data to show current quantities in the UI
      const cart = await fetchCart();
      renderWatches(data.watches, cart);
    } else {
      console.error(
        "Failed to fetch watches or invalid response format:",
        data
      );
    }
  } catch (error) {
    console.error("Error fetching watches:", error);
  }
}

// Fetch cart data from the backend
async function fetchCart() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/carts/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with proper auth management
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched cart data:", data);
      return data.cart[0]?.items || []; // Adjust according to backend structure
    } else {
      console.error("Failed to fetch cart data:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

// Render watches in the product grid
function renderWatches(watches, cart) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) {
    console.error("Product grid element not found.");
    return;
  }
  productGrid.innerHTML = ""; // Clear any existing content

  const productCount = document.getElementById("product-count");
  if (!productCount) {
    console.error("Product count element not found.");
  }

  watches.forEach((watch) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.dataset.gender = watch.category;
    productDiv.dataset.id = watch._id;

    // Find if this watch is already in the cart
    const cartItem = cart.find((item) => item.watchId === watch._id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    productDiv.innerHTML = `
        <img crossorigin="anonymous" src="http://localhost:3000${
          watch.watchImage
        }" alt="${watch.name}">
        <h3>${watch.name}</h3>
        <p>Php ${watch.price.toLocaleString()}</p>
        <button class="add-to-cart" onclick="addToCart('${watch._id}', ${
      quantityInCart + 1
    })">
          ${quantityInCart > 0 ? `Added (${quantityInCart})` : "Add to Cart"}
        </button>
      `;
    productGrid.appendChild(productDiv);
  });

  if (productCount) {
    productCount.textContent = watches.length;
  }

  filterProducts("all");
}

// Add an item to the cart
async function addToCart(watchId, quantity) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/carts/cart/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with proper auth management
        },
        body: JSON.stringify({ watchId, quantity }),
      }
    );

    if (response.ok) {
      alert("Item added to cart successfully!");

      // Update cart and UI
      await updateCartCount();
      await fetchWatches(); // Refresh watches to update the "Add to Cart" button text
    } else {
      const data = await response.json();
      console.error("Failed to add item to cart:", data.message);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

// Update the cart count in the header or a cart display element
async function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  try {
    const cart = await fetchCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountElement) {
      cartCountElement.innerText = totalItems; // Update the cart count
    }
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}

// Call this function when the page loads to set the initial cart count and fetch watches
window.onload = () => {
  updateCartCount();
  fetchWatches(); // Fetch watches when the page loads
};
