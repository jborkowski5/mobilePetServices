import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

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
            } else {
                const errorMessage = await response.json();
                console.error('Login failed:', errorMessage.message);
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleFormSubmit}>
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
            <p>Forgot your password? <a href="/change-password">Change Password</a></p>
            {/* Replace "/change-password" with the actual route for changing the password */}
        </div>
    );
};

export default Login;
