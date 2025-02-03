// Function to fetch cart items from the backend
async function fetchCart() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert("Please log in to view your cart.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/v1/cart", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        if (response.ok) {
            updateCartDisplay(data.cartItems); // Update UI with cart items
        } else {
            console.error("Error fetching cart items:", data.message);
            alert("Failed to fetch cart items.");
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        alert("An error occurred while fetching your cart.");
    }
}

// Function to update the cart display on the page
function updateCartDisplay(cartItems) {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const placeOrderButton = document.getElementById('place-order-btn');
    cartContainer.innerHTML = ''; // Clear the cart

    let totalPrice = 0;

    cartItems.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        // Add image
        const itemImg = document.createElement('img');
        itemImg.classList.add('cart-item-img');
        itemImg.src = item.img; 
        itemImg.alt = item.name;

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

    // Update total price
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
    const token = localStorage.getItem('authToken');
    
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

// Function to handle order placement
function placeOrder() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) {
        alert("Your cart is empty! Add items before placing an order.");
        return;
    }

    document.getElementById('shipping-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('shipping-modal').style.display = 'none';
}

// Function to submit the shipping form with validation
function submitShippingForm() {
    const name = document.getElementById('shipping-name').value;
    const address = document.getElementById('shipping-address').value;
    const phone = document.getElementById('shipping-phone').value;
    const email = document.getElementById('shipping-email').value;

    let valid = true;
    let message =
