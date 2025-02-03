async function fetchWatches() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/watches"); // Replace with your backend endpoint
    const data = await response.json();

    if (response.ok && data && Array.isArray(data.watches)) {
      console.log("Got the watches", data.watches);
      renderWatches(data.watches); // Pass the watch data to the render function
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

function renderWatches(watches) {
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

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  watches.forEach((watch) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.dataset.gender = watch.category;
    productDiv.dataset.id = watch._id;

    const cartItem = cart.find((item) => item.watchId === watch._id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    productDiv.innerHTML = `
      <img crossorigin="anonymous" src="http://localhost:3000${
        watch.watchImage
      }" alt="${watch.name}">
      <h3>${watch.name}</h3>
      <p>Php ${watch.price.toLocaleString()}</p>
      <button class="add-to-cart" onclick="addToCart('${watch._id}', '${
      watch.name
    }', '${watch.watchImage}', ${watch.price})">
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
