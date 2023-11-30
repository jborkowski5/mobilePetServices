import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Function to validate password
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
  return passwordRegex.test(password);
};

const ChangePassword = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [error, setError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  useEffect(() => {
    if (changeSuccess) {
      history.push('/user_info');
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
      setChangeSuccess(false); // Reset changeSuccess state
      return;
    }

    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('New passwords do not match.');
      setChangeSuccess(false); // Reset changeSuccess state
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
        setError(''); // Clear any previous error message
        setChangeSuccess(true);

        // Delay the redirection to show the success message before redirecting
        setTimeout(() => {
          history.push('/user_info');
        }, 20000); // Adjust the delay time (in milliseconds) as needed
      } else if (response.status === 401) {
        setError('Incorrect current password.');
        setChangeSuccess(false); // Reset changeSuccess state
      } else {
        const errorMessage = await response.json();
        setError(`Password change failed: ${errorMessage.message}`);
        setChangeSuccess(false); // Reset changeSuccess state
      }
    } catch (error) {
      setError(`Error occurred while changing password: ${error.message}`);
      setChangeSuccess(false); // Reset changeSuccess state
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: 'auto',
  };

  const inputStyle = {
    padding: '8px',
    margin: '8px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#ff00b5',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  const formContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Adjust the height to your preference
  };

  return (
    <div style={formContainerStyle}>
      <div>
      {changeSuccess && !error && (
          <p style={{ color: 'green' }}>Password changed successfully!</p>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form style={formStyle} onSubmit={handleFormSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
          value={formData.oldPassword}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="newPasswordConfirm"
          placeholder="Confirm New Password"
          value={formData.newPasswordConfirm}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Change Password
        </button>
      </form>
      </div>
    </div>
  );
};

export default ChangePassword;
