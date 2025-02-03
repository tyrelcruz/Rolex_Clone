async function fetchCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/carts/cart/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data.cart[0].items);
    if (response.ok && data.cart[0].items) {
      const watchDataPromises = data.cart[0].items.map(async (cartItem) => {
        const watchData = await getWatchById(cartItem.watchId); // Fetch watch data by watchId
        return {
          watchData, // Store the watch data object
          cartItemId: cartItem._id, // Store the cart item ID (changed from cartId to cartItemId)
          quantity: cartItem.quantity || 1, // Use quantity from cart item
        };
      });

      const watchItems = await Promise.all(watchDataPromises); // Wait for all watch data to be fetched
      const totalItems = watchItems.length; // Calculate total number of items
      const totalPrice = watchItems.reduce(
        (sum, item) => sum + item.watchData.price * item.quantity,
        0
      ); // Calculate total price

      updateCartDisplay(watchItems); // Update the UI with the watch details
    } else {
      console.error("Error fetching cart items:", data.message);
      alert("Failed to fetch cart items.");
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    alert("An error occurred while fetching your cart.");
  }
}

// Function to fetch a single watch by ID
async function getWatchById(watchId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/watches/${watchId}`
    );
    const watchData = await response.json();
    if (response.ok) {
      return watchData; // Return the watch data
    } else {
      console.error("Failed to fetch watch data:", watchData.message);
      return null; // Return null if the request fails
    }
  } catch (error) {
    console.error("Error fetching watch data:", error);
    return null; // Return null on error
  }
}

// Function to update the cart display on the page
// Function to update the cart display on the page
// Function to update the cart display on the page
function updateCartDisplay(cartItems) {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const placeOrderButton = document.getElementById("place-order-btn");
  const totalItemsElement = document.getElementById("total-items"); // Order Summary Total Items
  const summaryTotalPriceElement = document.getElementById(
    "summary-total-price"
  ); // Order Summary Total Price

  cartContainer.innerHTML = ""; // Clear the cart display
  let totalItems = 0;
  let totalPrice = 0;

  cartItems.forEach((item) => {
    if (!item || !item.watchData) return; // Skip if item is null (in case of an error in fetching)

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");

    // Add image
    const itemImg = document.createElement("img");
    itemImg.classList.add("cart-item-img");
    itemImg.src = item.watchData.watchImage; // Use watchImage from fetched watch data
    itemImg.alt = item.watchData.name; // Use watch name for alt text
    itemImg.crossOrigin = "anonymous"; // Set the crossorigin attribute

    // Add item details (name, price, and quantity)
    const itemDetails = document.createElement("div");
    itemDetails.classList.add("cart-item-details");

    const itemName = document.createElement("h3");
    itemName.classList.add("cart-item-name");
    itemName.innerText = item.watchData.name; // Use the watch name

    const itemPrice = document.createElement("p");
    itemPrice.classList.add("cart-item-price");

    const price = parseFloat(item.watchData.price); // Ensure price is a number
    itemPrice.innerText = `₱${price.toLocaleString()}`;

    // Add quantity input
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.classList.add("quantity-input");
    quantityInput.value = item.quantity || 1; // Default to 1
    quantityInput.min = 1;
    quantityInput.addEventListener("input", () => {
      updateCartItemQuantity(item.cartItemId, quantityInput.value); // Use cartItemId
    });

    // Add remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.innerText = "Remove";
    removeButton.onclick = () => removeCartItem(item.cartItemId); // Use cartItemId for removal

    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPrice);
    itemDetails.appendChild(quantityInput);
    itemDetails.appendChild(removeButton);

    cartItemDiv.appendChild(itemImg);
    cartItemDiv.appendChild(itemDetails);

    cartContainer.appendChild(cartItemDiv);

    // Update total price and total items
    const itemQuantity = item.quantity || 1;
    totalPrice += price * itemQuantity;
    totalItems += itemQuantity;
  });

  // Update total price display in the cart section
  totalPriceElement.innerText = `₱${totalPrice.toLocaleString()}`;

  // Update total items and total price in the order summary
  totalItemsElement.innerText = totalItems.toLocaleString();
  summaryTotalPriceElement.innerText = `₱${totalPrice.toLocaleString()}`;

  // Disable the "Place Order" button if the cart is empty
  placeOrderButton.disabled = cartItems.length === 0;
  placeOrderButton.style.opacity = cartItems.length === 0 ? "0.5" : "1";
}

// Function to add an item to the cart
// Function to add an item to the cart
async function addToCart(watchId, name, img, price, quantity = 1) {
  console.log(watchId, name, img, price, quantity);

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart
    const existingItem = cart.find((item) => item.watchId === watchId);

    if (existingItem) {
      // If item already exists, increase the quantity
      existingItem.quantity += quantity;
    } else {
      // If it's a new item, add it to the cart
      const cartItem = { watchId, quantity, name, img, price };
      cart.push(cartItem);
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Item added to cart:", cart);

    // Send the request to the backend to add the product to the user's cart (optional if you're syncing with the backend)
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

    // Update the cart count in the header
    updateCartCount();
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
}

// Function to update the quantity of an item in the cart
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
      fetchCart(); // Refresh the cart display
    } else {
      console.error("Failed to update item quantity:", data.message);
      alert("Failed to update item quantity.");
    }
  } catch (error) {
    console.error("Error updating item quantity:", error);
    alert("An error occurred while updating the item quantity.");
  }
}

// Function to remove an item from the cart
async function removeCartItem(cartItemId) {
  const token = localStorage.getItem("token");
  console.log(cartItemId);
  if (!token) {
    alert("Please log in to remove items from your cart.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/carts/cart/items/${cartItemId}`, // Use cartItemId in the URL
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
      fetchCart(); // Refresh the cart display
    } else {
      console.error("Failed to remove item from cart:", data.message);
      alert("Failed to remove item from the cart.");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    alert("An error occurred while removing the item from the cart.");
  }
}

// Call fetchCart() on page load to populate the cart display
window.onload = fetchCart;
