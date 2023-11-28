// Logout.js
import React, { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
            method: 'GET',
            });

            if (response.ok) {
            console.log('Logged out successfully!');
            // Optionally, handle further actions after successful logout
            } else {
            const errorMessage = await response.json();
            console.error('Logout failed:', errorMessage.message);
            // Handle error response
            }
        } catch (error) {
            console.error('Error occurred during logout:', error);
            // Handle fetch errors
        }
        };

        handleLogout();
    }, []);

    return (
        <div>
        <h2>Logout</h2>
        <p>Logging out...</p>
        </div>
    );
};

export default Logout;
