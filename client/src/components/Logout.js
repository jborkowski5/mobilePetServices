// Logout.js
import React, { useEffect } from 'react';
import { useAuth } from '././AuthContext';
import { useHistory } from 'react-router-dom'; // Import useHistory hook

const Logout = () => {
    const { logout } = useAuth();
    const history = useHistory(); // Access the history object

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await fetch('/logout', {
                    method: 'GET', // Change the method to POST
                });

                if (response.ok) {
                    console.log('Logged out successfully!');
                    logout();
                    history.push('/'); // Redirect to the Home page after successful logout
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
    }, [logout, history]); // Include 'logout' in the dependencies array to prevent unnecessary re-runs

    return (
        <div>
            <h2>Logout</h2>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;
