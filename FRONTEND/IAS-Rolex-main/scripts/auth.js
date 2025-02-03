async function isLoggedIn() {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isLoggedIn;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

document
  .getElementById("shop-link")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const loggedIn = await isLoggedIn();

    if (loggedIn) {
      window.location.href = "shop.html";
    } else {
      alert("Please log in to access the shop.");
      window.location.href = "login.html";
    }
  });

async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("You have been logged out.");
      window.location.href = "login.html";
    } else {
      alert("Failed to log out. Please try again.");
    }
  } catch (error) {
    console.error("Error logging out:", error);
    alert("An error occurred during logout.");
  }
}

async function handleAuthAction() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("You have been logged out.");
        updateAuthButton();
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  } else {
    window.location.href = "login.html";
  }
}

async function updateAuthButton() {
  const loggedIn = await isLoggedIn();
  const authButton = document.getElementById("auth-button");

  if (loggedIn) {
    authButton.textContent = "Logout";
  } else {
    authButton.textContent = "Login";
  }
}

window.onload = updateAuthButton;
