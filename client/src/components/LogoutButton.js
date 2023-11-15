// LogoutButton.js
import React from 'react';
import { useHistory } from 'react-router-dom';

const LogoutButton = ({ setLoginStatus }) => {
    const history = useHistory();

    const handleLogout = async () => {
        try {
        const response = await fetch('http://127.0.0.1:5000/logout', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('authToken');
            setLoginStatus(false); // Update login status
            history.push('/login');
        } else {
            // Handle logout failure
            console.error('Logout failed');
        }
        } catch (error) {
        // Handle network errors
        console.error('Logout error:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
