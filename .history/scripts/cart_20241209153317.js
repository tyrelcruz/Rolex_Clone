// Function to update the cart display
function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const placeOrderButton = document.getElementById('place-order-btn');
    cartContainer.innerHTML = ''; 

    let totalPrice = 0;

    cartItems.forEach((item, index) => {
        // Create the cart item HTML structure
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
        quantityInput.value = item.quantity || 1; // Default quantity to 1
        quantityInput.min = 1;
        quantityInput.addEventListener('input', () => {
            item.quantity = parseInt(quantityInput.value) || 1; 
            cartItems[index] = item; 
            localStorage.setItem('cart', JSON.stringify(cartItems));
            updateCart();
        });

        // Add remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-btn');
        removeButton.innerText = 'Remove';
        removeButton.onclick = () => removeFromCart(index);

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

    // Update total price display with PHP symbol and comma formatting
    totalPriceElement.innerText = `₱${totalPrice.toLocaleString()}`;

    // Update the order summary
    updateOrderSummary();

    // Disable the "Place Order" button if the cart is empty
    if (cartItems.length === 0) {
        placeOrderButton.disabled = true;
        placeOrderButton.style.opacity = "0.5";
    } else {
        placeOrderButton.disabled = false;
        placeOrderButton.style.opacity = "1";
    }
}

// Function to update the order summary
function updateOrderSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach((item) => {
        const quantity = item.quantity || 1;
        totalItems += quantity;
        totalPrice += parseFloat(item.price) * quantity;
    });

    // Display the total number of items and formatted total price
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('summary-total-price').textContent = `₱${totalPrice.toLocaleString()}`;
}

// Function to remove an item from the cart
function removeFromCart(index) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1); 
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCart();
}

window.onload = updateCart;

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
    let message = "";

    // Validate full name
    if (!name) {
        valid = false;
        message += "Name is required.\n";
    }

    // Validate address
    if (!address) {
        valid = false;
        message += "Address is required.\n";
    }

    // Validate phone number should be numbers only, and at least 10 digits
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
        valid = false;
        message += "Phone number must be between 10 to 15 digits.\n";
    }

    // Validate email (basic email format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        valid = false;
        message += "Please enter a valid email address.\n";
    }

    // If validation fails, show the error message
    if (!valid) {
        alert(message);
        return;
    }

    // If validation passes, proceed with the order
    alert('Order placed successfully!\nShipping Information:\n' +
        `Name: ${name}\nAddress: ${address}\nPhone: ${phone}\nEmail: ${email}`);
    
    localStorage.removeItem('cart'); // Clear the cart
    closeModal();
    updateCart();
}
