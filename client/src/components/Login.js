import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch('http://127.0.0.1:8080/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Login Successful:', result);
            // Perform necessary actions after successful login
        } else {
            const errorData = await response.json();
            console.error('Login Error:', errorData.error);
            // Optionally, display an error message to the user
        }
        } catch (error) {
        console.error('Login Error:', error);
        // Handle other login errors if any
        }
    };

    const handleLogout = async () => {
        try {
        const response = await fetch('http://127.0.0.1:8080/logout', {
            method: 'GET',
            // Add any necessary headers for authentication if required
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Logout Successful:', result);
            // Perform necessary actions after successful logout
        } else {
            const errorData = await response.json();
            console.error('Logout Error:', errorData.error);
            // Optionally, display an error message to the user
        }
        } catch (error) {
        console.error('Logout Error:', error);
        // Handle other logout errors if any
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Username:
                    <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    />
                </label>
                </div>
                <div>
                <label>
                    Password:
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    />
                </label>
                </div>
            <button type="submit">Login</button>
        </form>
        <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Login;
