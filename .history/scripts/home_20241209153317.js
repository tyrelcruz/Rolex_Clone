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

// Carousel Functionality
let currentIndex = 0;
const carousel = document.getElementById("carousel");
const descriptions = ["Rolex Day-Date Blue Roman", "Rolex Day-Date Mint Green", "Rolex Day-Date Green Obre and Diamonds", "Rolex Day-Date White Gold and Diamonds", "Rolex Day-Date Everose Gold Chocolate", "Rolex Sky-Dweller"];
const carouselText = document.getElementById("carousel-text");

function updateCarousel() {
    const images = carousel.querySelectorAll("img");

    // Remove the active class from all images
    images.forEach(img => img.classList.remove("active"));

    // Add the active class to the current image
    images[currentIndex].classList.add("active");

    // Move the carousel to the correct position
    const carouselWidth = carousel.offsetWidth;
    const imageWidth = images[0].offsetWidth;
    const totalMove = currentIndex * (imageWidth + 10); 

    carousel.style.transform = `translateX(-${totalMove}px)`;
    carouselText.textContent = descriptions[currentIndex];
}

function prevSlide() {
    currentIndex = (currentIndex === 0) ? descriptions.length - 1 : currentIndex - 1;
    updateCarousel();
}

function nextSlide() {
    currentIndex = (currentIndex === descriptions.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
}

// Initialize the carousel
updateCarousel();

// Toggle Menu 
const sideMenu = document.getElementById("side-menu");

function toggleMenu() {
    sideMenu.classList.toggle("open");
}

// Intersection Observer for Slow Rise-Up Animation
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 }); 

// Target all elements in Panels 2 and 3 that need the rise-up animation
const elementsToAnimate = document.querySelectorAll('.panel-2 .text-content, .panel-3 .text-content, .panel-2 .carousel-container, .panel-3 .carousel-container, .panel-2 .content, .panel-3 .content, .panel-2 .images, .panel-3 .images');

elementsToAnimate.forEach(element => {
    observer.observe(element);
});

// Get elements
const subscribeButton = document.getElementById("subscribe-btn");
const subscribeModal = document.getElementById("subscribeModal");
const closeModalButton = document.getElementById("close-btn");
const submitButton = document.getElementById("submit-btn");
const emailInput = document.getElementById("email");
const modalMessage = document.getElementById("modal-message");

// Initially hide the modal
subscribeModal.style.display = "none";

// Open the modal when the Subscribe button is clicked
subscribeButton.addEventListener("click", () => {
    subscribeModal.style.display = "flex"; // Show modal
});

// Close the modal when the Close button (X) is clicked
closeModalButton.addEventListener("click", () => {
    subscribeModal.style.display = "none"; // Hide modal
});

// Close the modal if the user clicks outside the modal
window.addEventListener("click", (event) => {
    if (event.target === subscribeModal) {
        subscribeModal.style.display = "none"; // Hide modal
    }
});

// Handle form submission (email input)
submitButton.addEventListener("click", (event) => {
    event.preventDefault(); 

    const email = emailInput.value.trim();

    if (email && validateEmail(email)) {
        // Hide the modal and show success message
        subscribeModal.style.display = "none";
        
        // Change the subscribe button to "Subscribed" and disable it
        subscribeButton.textContent = "Subscribed";
        subscribeButton.disabled = true; // Disable the button

        alert("You have successfully subscribed!");
        // Clear the email input and reset the form
        emailInput.value = "";
    } else {
        modalMessage.textContent = "Please enter a valid email address.";
        modalMessage.style.color = "red";
    }
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
