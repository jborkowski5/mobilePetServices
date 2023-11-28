import React, { useState } from 'react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/change_password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: formData.oldPassword, // Include the old password field
                    new_password: formData.newPassword, // Include the new password field
                }),
            });

            if (response.ok) {
                console.log('Password changed successfully!');
            } else {
                const errorMessage = await response.json();
                console.error('Password change failed:', errorMessage.message);
            }
        } catch (error) {
            console.error('Error occurred while changing password:', error);
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                />
                <br />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                />
                <br />
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
