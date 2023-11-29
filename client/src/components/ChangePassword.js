import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

// Function to validate password
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
  return passwordRegex.test(password);
};

const ChangePassword = () => {
  const history = useHistory(); // Get the history object

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const [error, setError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false); // State for password change success

  useEffect(() => {
    if (changeSuccess) {
      history.push('/user_info'); // Redirect to the UserInfo component route
    }
  }, [changeSuccess, history]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword(formData.newPassword)) {
      setError(
        'New password should contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one symbol.'
      );
      return;
    }

    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/change_password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
        }),
      });

      if (response.ok) {
        console.log('Password changed successfully!');
        setChangeSuccess(true); // Set password change success state to true
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
      {changeSuccess && (
        <p style={{ color: 'green' }}>Password changed successfully!</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
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
        <input
          type="password"
          name="newPasswordConfirm"
          placeholder="Confirm New Password"
          value={formData.newPasswordConfirm}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
