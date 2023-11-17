import React, { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    address: '',
    phone_number: '',
    animal_type: '',
    animal_breed: '',
    animal_color: '',
    animal_weight: '',
    animal_temperament: '',
    animal_photo: null,
    animal_name: '',
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'animal_photo' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/register', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration Successful:', result);
        // Reset form fields if needed
        setFormData({
          username: '',
          password: '',
          name: '',
          address: '',
          phone_number: '',
          animal_type: '',
          animal_breed: '',
          animal_color: '',
          animal_weight: '',
          animal_temperament: '',
          animal_photo: null,
          animal_name: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Registration Error:', errorData.error);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Registration Error:', error);
      // Handle other registration errors if any
    }
  };

  return (
    <div>
      <h2>Registration</h2>
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
        <div>
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Type:
            <input
              type="text"
              name="animal_type"
              value={formData.animal_type}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Breed:
            <input
              type="text"
              name="animal_breed"
              value={formData.animal_breed}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Color:
            <input
              type="text"
              name="animal_color"
              value={formData.animal_color}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Weight:
            <input
              type="text"
              name="animal_weight"
              value={formData.animal_weight}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Temperament:
            <input
              type="text"
              name="animal_temperament"
              value={formData.animal_temperament}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Photo:
            <input
              type="file"
              name="animal_photo"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Animal Name:
            <input
              type="text"
              name="animal_name"
              value={formData.animal_name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;