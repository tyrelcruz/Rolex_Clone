// Header hide on scroll
let prevScrollPos = window.pageYOffset;
const header = document.getElementById("header");
window.onscroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
        header.classList.remove("hide-header");
    } else {
        header.classList.add("hide-header");
    }
    prevScrollPos = currentScrollPos;
};

// Toggle Menu 
const sideMenu = document.getElementById("side-menu");

function toggleMenu() {
    sideMenu.classList.toggle("open");
}

// Slideshow
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slides img");
    
    // Ensure the first image is visible on load
    if (slides.length > 0) {
        slides[0].classList.add("active");
    }

    let currentSlide = 0;

    setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }, 3000); // Change image every 3 seconds
});

// Fetching watches from the backend API
async function fetchWatches() {
    try {
        const response = await fetch("http://localhost:5000/api/v1/watches"); // Replace with your backend endpoint
        const data = await response.json();

        if (response.ok) {
            renderWatches(data.watches); // Pass the watch data to the render function
        } else {
            console.error("Failed to fetch watches:", data.message);
        }
    } catch (error) {
        console.error("Error fetching watches:", error);
    }
}

// Render watches in the product grid
function renderWatches(watches) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear any existing content

    watches.forEach(watch => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.dataset.gender = watch.category;
        productDiv.dataset.id = watch._id;

        // Add product content
        productDiv.innerHTML = `
            <img src="${watch.watchImage}" alt="${watch.name}">
            <h3>${watch.name}</h3>
            <p>Php ${watch.price.toLocaleString()}</p>
            <button class="add-to-cart" onclick="addToCart('${watch.name}', '${watch.watchImage}', ${watch.price})">Add to Cart</button>
        `;
        productGrid.appendChild(productDiv);
    });

    // Update results count dynamically
    document.getElementById('product-count').textContent = watches.length;
}

// Filter products based on the selected category
document.addEventListener('DOMContentLoaded', () => {
    const sortDropdown = document.getElementById('sort');
    const products = document.querySelectorAll('.product');
    const resultsCount = document.getElementById('results-count');

    // Function to filter products
    function filterProducts(filterValue) {
        let visibleCount = 0;
        const allProducts = document.querySelectorAll('.product');

        allProducts.forEach((product) => {
            const gender = product.getAttribute('data-gender');
            const isVisible = filterValue === 'all' || filterValue === gender;
            product.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update results count dynamically
        resultsCount.textContent = `Showing 1–${visibleCount} of ${allProducts.length} results`;
    }

    // Event Listener for Sorting
    sortDropdown.addEventListener('change', (e) => {
        filterProducts(e.target.value);
    });

    // Initially show all products
    filterProducts('all');
});

// Function to add item to cart
function addToCart(productName, productImg, productPrice) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.name === productName && item.img === productImg);

    if (existingItemIndex !== -1) {
        // If item already exists, update the quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If item doesn't exist, add a new item with quantity set to 1
        const newItem = {
            name: productName,
            img: productImg,
            price: productPrice,
            quantity: 1
        };
        cart.push(newItem);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count in the header
    updateCartCount();
}

// Function to update cart item count in the header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').innerText = cart.length;
}

// Call this function when the page loads to set the initial cart count and fetch watches
window.onload = () => {
    updateCartCount();
    fetchWatches(); // Fetch watches when the page loads
};
