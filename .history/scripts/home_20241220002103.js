document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has a token in localStorage
    const token = localStorage.getItem('token'); // Assuming the token is stored with the key 'token'
  
    // Shop link redirect logic
    const shopLink = document.getElementById('shop-link');
  
    if (!token) {
      // If there is no token, redirect to the login page when clicking the shop link
      shopLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default action
        window.location.href = 'login.html'; // Redirect to login page
      });
    }
  
    // Side menu toggle
    const sideMenu = document.getElementById('side-menu');
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
  
    menuBtn.addEventListener('click', () => {
      sideMenu.classList.add('open'); // Show side menu
    });
  
    closeBtn.addEventListener('click', () => {
      sideMenu.classList.remove('open'); // Hide side menu
    });
  
    // Carousel functionality
    let currentSlideIndex = 0;
    const carousel = document.getElementById('carousel');
    const carouselImages = carousel.getElementsByTagName('img');
    const carouselText = document.getElementById('carousel-text');
    
    const descriptions = [
      "Watch 1 Description",
      "Watch 2 Description",
      "Watch 3 Description",
      "Watch 4 Description",
      "Watch 5 Description",
      "Watch 6 Description",
    ];
  
    function updateCarousel() {
      // Set the correct image and description based on the current index
      for (let i = 0; i < carouselImages.length; i++) {
        carouselImages[i].style.display = (i === currentSlideIndex) ? 'block' : 'none';
      }
      carouselText.textContent = descriptions[currentSlideIndex];
    }
  
    function nextSlide() {
      currentSlideIndex = (currentSlideIndex + 1) % carouselImages.length;
      updateCarousel();
    }
  
    function prevSlide() {
      currentSlideIndex = (currentSlideIndex - 1 + carouselImages.length) % carouselImages.length;
      updateCarousel();
    }
  
    // Initialize carousel
    updateCarousel();
    // Attach event listeners to carousel buttons
    document.querySelector('.carousel-btn.right').addEventListener('click', nextSlide);
    document.querySelector('.carousel-btn.left').addEventListener('click', prevSlide);
  
    // Modal for newsletter subscription
    const subscribeBtn = document.getElementById('subscribe-btn');
    const subscribeModal = document.getElementById('subscribeModal');
    const closeModalBtn = document.getElementById('close-btn');
    const submitBtn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const modalMessage = document.getElementById('modal-message');
  
    subscribeBtn.addEventListener('click', () => {
      subscribeModal.style.display = 'block'; // Show the modal
    });
  
    closeModalBtn.addEventListener('click', () => {
      subscribeModal.style.display = 'none'; // Close the modal
    });
  
    submitBtn.addEventListener('click', () => {
      const email = emailInput.value;
      
      if (!email) {
        modalMessage.textContent = 'Please enter a valid email.';
        return;
      }
  
      // Perform AJAX to submit email if needed (for now, it's a simple alert)
      alert(`You have subscribed with ${email}`);
      subscribeModal.style.display = 'none'; // Close modal after submission
    });
  
    // Prevent the modal from closing when clicking inside
    subscribeModal.addEventListener('click', (e) => {
      if (e.target === subscribeModal) {
        subscribeModal.style.display = 'none'; // Close modal when clicking outside
      }
    });
  });
  