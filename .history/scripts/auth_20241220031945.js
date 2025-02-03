// Function to check login status by communicating with the backend
async function isLoggedIn() {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
      credentials: "include", // Include cookies for session-based authentication
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isLoggedIn; // Expecting { isLoggedIn: true/false } in response
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

// Redirect based on login status
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

// Logout function
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

// Function to handle auth action (login/logout)
async function handleAuthAction() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    // Log out the user
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
        updateAuthButton(); // Update button after logout
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  } else {
    // Redirect to login page
    window.location.href = "login.html";
  }
}

// Function to dynamically update the auth button
async function updateAuthButton() {
  const loggedIn = await isLoggedIn();
  const authButton = document.getElementById("auth-button");

  if (loggedIn) {
    authButton.textContent = "Logout";
  } else {
    authButton.textContent = "Login";
  }
}

// Call this function on page load and whenever login/logout occurs
window.onload = updateAuthButton;
