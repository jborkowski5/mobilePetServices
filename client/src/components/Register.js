import React, { useState } from 'react';
import '../Register.css';

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        address: '',
        phone_number: '',
        email: '',
        // Add other fields like address, phone_number, email if needed
    });

    const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for registration success
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let formattedValue = value;

        // Format phone number input
        if (name === 'phone_number') {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData({ ...formData, [name]: formattedValue });
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[A-Za-z0-9_-]{1,15}$/;
        return usernameRegex.test(username);
    };

    const validateName = (name) => {
        // Add additional rules for name validation if needed
        return name.trim() !== '';
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!validatePassword(formData.password)) {
            setError('Password should contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one symbol.');
            return;
        }

        if (!validateUsername(formData.username)) {
            setError('Username should contain letters, numbers, underscores, hyphens, and be 1 to 15 characters long.');
            return;
        }

        if (!validateName(formData.name)) {
            setError('Name is required.');
            return;
        }

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
                setRegistrationSuccess(true); // Set registration success state to true
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

    const formatPhoneNumber = (value) => {
        const phoneNumber = value.replace(/\D/g, ''); // Remove non-digit characters

        if (phoneNumber.length > 0) {
            // Format phone number as (555) 555-5555
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }

        return phoneNumber; // Return the original value if empty or invalid
    };

    // Redirect to the login page after successful registration
    if (registrationSuccess) {
        return (
            <div>
                <h2>Registration Successful!</h2>
                <p>Your account has been created successfully.</p>
                <p>Please <a href="/login">Login</a> to continue.</p>
            </div>
        );
    }

    return (
        <div className="register-container">
        <h2 className="register-heading">Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="register-form" onSubmit={handleFormSubmit}>
            <input
            type="text"
            name="name"
            placeholder="First & Last Name"
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
            placeholder="Address, City, State, Postal"
            value={formData.address}
            onChange={handleInputChange}
            />
            <br />
            <input
            type="text"
            name="phone_number"
            placeholder="Phone (555) 555-5555"
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
