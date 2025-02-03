const sideMenu = document.getElementById("side-menu");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");

menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("open"); // Show side menu
});

closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("open"); // Hide side menu
});

// Fetching watches from the backend API
async function fetchWatches() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/watches");
    const cartResponse = await fetch(
      "http://localhost:3000/api/v1/carts/cart",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your token management
        },
      }
    );

    const watchesData = await response.json();
    const cartData = await cartResponse.json();

    if (response.ok && cartResponse.ok) {
      console.log("Fetched watches and cart successfully");
      renderWatches(watchesData.watches, cartData.cart[0].items || []);
    } else {
      console.error(
        "Failed to fetch data:",
        watchesData.message || cartData.message
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
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

  watches.forEach((watch) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.dataset.gender = watch.category;
    productDiv.dataset.id = watch._id;

    // Check if the watch is in the cart
    const cartItem = cart.find((item) => item.watchId === watch._id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Add product content
    productDiv.innerHTML = `
      <img crossorigin="anonymous" src="http://localhost:3000${
        watch.watchImage
      }" alt="${watch.name}">
      <h3>${watch.name}</h3>
      <p>Php ${watch.price.toLocaleString()}</p>
      <button class="add-to-cart" onclick="addToCart('${watch._id}')">
        ${quantityInCart > 0 ? `Added (${quantityInCart})` : "Add to Cart"}
      </button>
    `;
    productGrid.appendChild(productDiv);
  });

  // Update results count dynamically
  document.getElementById("product-count").textContent = watches.length;

  // Initialize category filter (show all watches)
  filterProducts("all");
}

// Add an item to the cart
async function addToCart(watchId) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/carts/cart/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with proper auth management
        },
        body: JSON.stringify({ watchId, quantity: 1 }), // Always add 1
      }
    );

    if (response.ok) {
      const updatedCart = await response.json();
      console.log("Cart updated successfully:", updatedCart);

      // Update cart count and UI
      await updateCartCount();
      await fetchWatches(); // Refresh watches to update the UI
    } else {
      const data = await response.json();
      console.error("Failed to add item to cart:", data.message);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

// Filter products based on the selected category (men, women, or all)
function filterProducts(filterValue) {
  const allProducts = document.querySelectorAll(".product");
  let visibleCount = 0;

  allProducts.forEach((product) => {
    const gender = product.getAttribute("data-gender");

    // Check if it matches the filter
    const isVisible = filterValue === "all" || filterValue === gender;

    // Toggle display based on match
    product.style.display = isVisible ? "block" : "none";
    if (isVisible) visibleCount++;
  });

  // Update results count dynamically
  const resultsCount = document.getElementById("results-count");
  resultsCount.textContent = `Showing 1–${visibleCount} of ${allProducts.length} results`;
}

// Event Listeners for Men/Women Tab Clicks
document.addEventListener("DOMContentLoaded", () => {
  const menTab = document.getElementById("men-tab");
  const womenTab = document.getElementById("women-tab");
  const allTab = document.getElementById("all-tab");

  if (menTab) {
    menTab.addEventListener("click", () => {
      filterProducts("men");
    });
  }

  if (womenTab) {
    womenTab.addEventListener("click", () => {
      filterProducts("women");
    });
  }

  if (allTab) {
    allTab.addEventListener("click", () => {
      filterProducts("all");
    });
  }
});

// Function to update the cart item count in the header or a cart display element
async function updateCartCount() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/carts/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with token
      },
    });

    if (response.ok) {
      const data = await response.json();
      const totalItems = data.cart[0].items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const cartCountElement = document.getElementById("cart-count");
      if (cartCountElement) {
        cartCountElement.innerText = totalItems;
      }
    } else {
      console.error("Failed to fetch cart data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

// Call this function when the page loads to set the initial cart count and fetch watches
window.onload = () => {
  updateCartCount();
  fetchWatches();
};
