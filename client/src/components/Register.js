import React, { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        // Add other fields like address, phone_number, email if needed
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('User registered successfully!');
            // Optionally, handle further actions after successful registration
        } else {
            const errorMessage = await response.json();
            console.error('Registration failed:', errorMessage.message);
            // Handle error response
        }
        } catch (error) {
        console.error('Error occurred during registration:', error);
        // Handle fetch errors
        }
    };

    return (
        <div>
        <h2>Register</h2>
        <form onSubmit={handleFormSubmit}>
            <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            />
            <br />
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
            <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            />
            <br />
            <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            />
            <br />
            <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            />
            <br />
            <button type="submit">Register</button>
        </form>
        </div>
    );
};

export default Register;
