// Slideshow (unchanged)
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
        const response = await fetch("http://localhost:3000/api/v1/watches"); // Replace with your backend endpoint
        const data = await response.json();

        if (response.ok) {
            console.log('got the watches');
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
        productDiv.dataset.gender = watch.category;  // Add gender category for filtering
        productDiv.dataset.id = watch._id;
        
        // Add product content
        productDiv.innerHTML = `
            <img crossorigin="anonymous" src="http://localhost:3000${watch.watchImage}" alt="${watch.name}">
            <h3>${watch.name}</h3>
            <p>Php ${watch.price.toLocaleString()}</p>
            <button class="add-to-cart" onclick="addToCart('${watch.name}', '${watch.watchImage}', ${watch.price})">Add to Cart</button>
        `;
        productGrid.appendChild(productDiv);
    });

    // Update results count dynamically
    document.getElementById('product-count').textContent = watches.length;

    // Initialize category filter (show all watches)
    filterProducts('all');
}

// Filter products based on the selected category (men or women)
function filterProducts(filterValue) {
    const allProducts = document.querySelectorAll('.product');
    let visibleCount = 0;

    allProducts.forEach((product) => {
        const gender = product.getAttribute('data-gender');  // Get the data-gender attribute
        console.log(`Filtering product: ${product.innerHTML}, Category: ${gender}`); // Log the gender for each product

        // Check if the product should be visible
        const isVisible =  filterValue === gender || filterValue === 'all' ;
        product.style.display = isVisible ? 'block' : 'none';  // Show or hide the product

        if (isVisible) visibleCount++;
    });

    // Update the results count dynamically
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = `Showing 1–${visibleCount} of ${allProducts.length} results`;
}

// Event Listeners for Men/Women Tab Clicks
document.addEventListener('DOMContentLoaded', () => {
    const menTab = document.getElementById('men-tab');
    const womenTab = document.getElementById('women-tab');
    const allTab = document.getElementById('all-tab');  // Add a tab for all products if needed

    // Filter by Men
    if (menTab) {
        menTab.addEventListener('click', () => {
            console.log('Filter by Men');
            filterProducts('men');
        });
    }

    // Filter by Women
    if (womenTab) {
        womenTab.addEventListener('click', () => {
            console.log('Filter by Women');
            filterProducts('women');
        });
    }

    // Filter by All (optional)
    if (allTab) {
        allTab.addEventListener('click', () => {
            console.log('Filter by All');
            filterProducts('all');
        });
    }
});

// Function to update the cart item count in the header or a cart display element
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;  // Show the number of items in the cart
    }
}

// Call this function when the page loads to set the initial cart count and fetch watches
window.onload = () => {
    updateCartCount();
    fetchWatches(); // Fetch watches when the page loads
};
