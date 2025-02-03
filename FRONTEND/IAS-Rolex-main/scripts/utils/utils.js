const sideMenu = document.getElementById("side-menu");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");

menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("open"); // Show side menu
});

closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("open"); // Hide side menu
});
export function renderAuthButton() {
  const authButton = document.createElement("button");
  authButton.id = "auth-button";

  const isLoggedIn = !!localStorage.getItem("token");

  if (isLoggedIn) {
    authButton.textContent = "LOG OUT";
    authButton.classList.add("logged-in"); // Add CSS class for logged-in state
    authButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "home.html";
    });
  } else {
    authButton.textContent = "SIGN IN";
    authButton.classList.remove("logged-in"); // Remove the class when logged out
    authButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  const nav = sideMenu.querySelector("nav");
  if (nav) {
    const existingAuthButton = document.getElementById("auth-button");
    if (existingAuthButton) {
      nav.replaceChild(authButton, existingAuthButton);
    } else {
      nav.appendChild(authButton);
    }
  }
}
