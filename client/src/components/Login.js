import React, { useState } from 'react';
import { useAuth } from '././AuthContext';
import { Link, useHistory } from 'react-router-dom'; // Import Link and useHistory from react-router-dom
import '../Login.css';

const Login = () => {
  const { login } = useAuth();
  const history = useHistory(); // Access the history object
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(''); // State for login error message

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { user_id } = responseData;

        console.log('Login successful! User ID:', user_id);
        localStorage.setItem('userId', user_id);
        login();

        // Redirect to the userinfo page after successful login
        history.push('/user_info');
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message); // Set error message state for failed login
        console.error('Login failed:', errorMessage.message);
      }
    } catch (error) {
      setError('Error occurred during login'); // Set error message state for other errors
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="login-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <p>
        If you haven't registered yet,{' '}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
