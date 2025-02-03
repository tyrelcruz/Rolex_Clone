document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form input values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
        console.log(JSON.stringify({ username, email, password }));
      // Send registration request to the server
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        alert('Registration successful! You can now log in.');
        window.location.href = 'login.html';
      } else {
        // Handle errors
        alert(data.msg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while trying to register. Please try again later.');
    }
  });
});
