// Function to fetch cart items from the backend
async function fetchCart() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/v1/carts/cart/", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        console.log(data.cart[0].items);
        if (response.ok && data.cart[0].items) {
            const watchDataPromises = data.cart[0].items.map(watchId => getWatchById(watchId)); // Fetch details for all watch IDs
            const watchItems = await Promise.all(watchDataPromises); // Wait for all watch data to be fetched
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
async function getWatchById(watchIdObject) {
    watchId = watchIdObject.watchId;
    try {
        const response = await fetch(`http://localhost:3000/api/v1/watches/${watchId}`);
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
function updateCartDisplay(cartItems) {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const placeOrderButton = document.getElementById('place-order-btn');
    cartContainer.innerHTML = ''; // Clear the cart display

    let totalPrice = 0;
    
    cartItems.forEach((item, index) => {
        if (!item) return; // Skip if item is null (in case of an error in fetching)

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        // Add image
        const itemImg = document.createElement('img');
        itemImg.classList.add('cart-item-img');
        itemImg.src = item.watchImage; 
        itemImg.alt = item.name;
        itemImg.crossOrigin = "anonymous";  // Set the crossorigin attribute
        

        // Add item details (name, price, and quantity)
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('cart-item-details');

        const itemName = document.createElement('h3');
        itemName.classList.add('cart-item-name');
        itemName.innerText = item.name;

        const itemPrice = document.createElement('p');
        itemPrice.classList.add('cart-item-price');
        
        const price = parseFloat(item.price); // Ensure price is a number
        itemPrice.innerText = `₱${price.toLocaleString()}`;

        // Add quantity input
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.classList.add('quantity-input');
        quantityInput.value = item.quantity || 1; // Default to 1
        quantityInput.min = 1;
        quantityInput.addEventListener('input', () => {
            updateCartItemQuantity(item._id, quantityInput.value);
        });

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.innerText = 'Remove';
        removeButton.onclick = () => removeCartItem(item._id);

        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemPrice);
        itemDetails.appendChild(quantityInput);
        itemDetails.appendChild(removeButton);

        cartItemDiv.appendChild(itemImg);
        cartItemDiv.appendChild(itemDetails);

        cartContainer.appendChild(cartItemDiv);

        // Update total price
        totalPrice += price * (item.quantity || 1);
    });

    // Update total price display
    totalPriceElement.innerText = `₱${totalPrice.toLocaleString()}`;

    // Disable the "Place Order" button if the cart is empty
    placeOrderButton.disabled = cartItems.length === 0;
    placeOrderButton.style.opacity = cartItems.length === 0 ? "0.5" : "1";
}

// Function to add an item to the cart
async function addToCart(watchId, watchName, watchImage, watchPrice) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert("Please log in to add items to your cart.");
        return;
    }

    const body = {
        watchId: watchId,
        quantity: 1, // Add one by default, modify as needed
    };

    try {
        const response = await fetch("http://localhost:3000/api/v1/cart/items", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Item added to cart.");
            fetchCart(); // Refresh the cart display
        } else {
            console.error("Failed to add item to cart:", data.message);
            alert("Failed to add item to the cart.");
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        alert("An error occurred while adding the item to the cart.");
    }
}

// Function to update the quantity of an item in the cart
async function updateCartItemQuantity(itemId, quantity) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert("Please log in to update cart items.");
        return;
    }

    const body = {
        quantity: parseInt(quantity),
    };

    try {
        const response = await fetch(`http://localhost:3000/api/v1/cart/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Item quantity updated.");
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
async function removeCartItem(itemId) {
    const token = localStorage.getItem('token');
        console.log(itemId);
    if (!token) {
        alert("Please log in to remove items from your cart.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

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
