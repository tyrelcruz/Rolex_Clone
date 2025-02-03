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

//Slideshow
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


//FilterProducts
document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const sortDropdown = document.getElementById('sort');
    const resultsCount = document.getElementById('results-count');

    // Function to filter products
    function filterProducts(filterValue) {
        let visibleCount = 0;

        products.forEach((product) => {
            const gender = product.getAttribute('data-gender');
            const isVisible = filterValue === 'all' || filterValue === gender;
            product.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update results count dynamically
        resultsCount.textContent = `Showing 1–${visibleCount} of ${products.length} results`;
    }

    // Event Listener for Sorting
    sortDropdown.addEventListener('change', (e) => {
        filterProducts(e.target.value);
    });

    // Show all products initially
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

// Call this function when the page loads to set the initial cart count
window.onload = updateCartCount;
