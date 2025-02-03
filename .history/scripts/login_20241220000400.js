document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Get form input values
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
        // Send login request to the server
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Store the token in localStorage
          localStorage.setItem('token', data.token);
  
          // Redirect to the home page
          alert('Login successful');
          window.location.href = 'home.html';
        } else {
          // Handle errors
          alert(data.msg || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while trying to log in. Please try again later.');
      }
    });
  });
  