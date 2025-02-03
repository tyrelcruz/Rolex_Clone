import { renderAuthButton } from "./utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const shopLink = document.getElementById("shop-link");

  if (!token) {
    shopLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "login.html";
    });
  }
  renderAuthButton();

  let currentSlideIndex = 0;
  const carousel = document.getElementById("carousel");
  const carouselImages = carousel.getElementsByTagName("img");
  const carouselText = document.getElementById("carousel-text");

  const descriptions = [
    "Watch 1 Description",
    "Watch 2 Description",
    "Watch 3 Description",
    "Watch 4 Description",
    "Watch 5 Description",
    "Watch 6 Description",
  ];

  function updateCarousel() {
    for (let i = 0; i < carouselImages.length; i++) {
      carouselImages[i].style.display =
        i === currentSlideIndex ? "block" : "none";
    }
    carouselText.textContent = descriptions[currentSlideIndex];
  }

  function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % carouselImages.length;
    updateCarousel();
  }

  function prevSlide() {
    currentSlideIndex =
      (currentSlideIndex - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
  }

  updateCarousel();
  document
    .querySelector(".carousel-btn.right")
    .addEventListener("click", nextSlide);
  document
    .querySelector(".carousel-btn.left")
    .addEventListener("click", prevSlide);

  const subscribeBtn = document.getElementById("subscribe-btn");
  const subscribeModal = document.getElementById("subscribeModal");
  const closeModalBtn = document.getElementById("close-btn");
  const submitBtn = document.getElementById("submit-btn");
  const emailInput = document.getElementById("email");
  const modalMessage = document.getElementById("modal-message");

  subscribeBtn.addEventListener("click", () => {
    subscribeModal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", () => {
    subscribeModal.style.display = "none";
  });

  submitBtn.addEventListener("click", () => {
    const email = emailInput.value;

    if (!email) {
      modalMessage.textContent = "Please enter a valid email.";
      return;
    }

    alert(`You have subscribed with ${email}`);
    subscribeModal.style.display = "none";
  });

  subscribeModal.addEventListener("click", (e) => {
    if (e.target === subscribeModal) {
      subscribeModal.style.display = "none";
    }
  });
});
