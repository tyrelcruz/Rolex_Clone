document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

//Missing anti clickjacking
app.use(helmet.frameguard({action: 'deny'}));

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      console.log(JSON.stringify({ username, email, password }));
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: username, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
      } else {
        alert(data.msg || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert(
        "An error occurred while trying to register. Please try again later."
      );
    }
  });
});
