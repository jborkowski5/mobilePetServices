import React, { useState } from 'react';

const AnimalForm = ({ user, animal, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: animal ? animal.name : '',
    type: animal ? animal.type : 'Dog',
    breed: animal ? animal.breed : '',
    weight: animal ? animal.weight : '',
    temperament: animal ? animal.temperament : '',
  });

  const animalTypes = ['Dog', 'Cat', 'Bird', 'Other'];

  // Hardcoded list of animal temperaments
  const animalTemperaments = [
    'Friendly',
    'Playful',
    'Mild',
    'Aggressive',
    'Wild AF',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled or selected
    const { name, type, breed, weight, temperament } = formData;
    if (!name || !type || !breed || !weight || !temperament) {
      alert('Please fill out all fields.');
      return;
    }

    // Makes sure weight is not negative
    if (formData.weight < 0) {
      alert('Weight cannot be negative.');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    color: '#000',
    textAlign: 'center',
  };
  
  const headerStyle = {
    marginBottom: '20px',
    color: '#ff00b5',
    fontSize: '24px',
  };
  
  const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  
  const inputStyle = {
    padding: '8px',
    margin: '5px',
    borderRadius: '4px',
    border: '1px solid #000',
    width: '40%',
    boxSizing: 'border-box',
  };
  
  const selectStyle = {
    padding: '8px',
    margin: '5px',
    borderRadius: '4px',
    border: '1px solid #000',
    width: '40%', 
    boxSizing: 'border-box',
  };
  
  const buttonStyle = {
    margin: '10px',
    padding: '8px 16px',
    backgroundColor: '#ff00b5',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
  <h2 style={headerStyle}>Add Your Fur-Baby!</h2>
  <div style={inputContainerStyle}>
    <input
      style={inputStyle}
      type="text"
      placeholder="Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
    />
    <input
      style={inputStyle}
      type="text"
      placeholder="Breed (Dogs Only)"
      name="breed"
      value={formData.breed}
      onChange={handleChange}
    />
    <input
      style={inputStyle}
      type="number"
      placeholder="Weight"
      name="weight"
      value={formData.weight}
      onChange={handleChange}
      step="1"
    />
    <select
      style={selectStyle}
      name="type"
      value={formData.type}
      onChange={handleChange}
    >
      {animalTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
    <select
      style={selectStyle}
      name="temperament"
      value={formData.temperament}
      onChange={handleChange}
    >
      <option value="" disabled>
        Select Temperament
      </option>
      {animalTemperaments.map((temperament) => (
        <option key={temperament} value={temperament}>
          {temperament}
        </option>
      ))}
    </select>
  </div>
  <button style={buttonStyle} type="submit">
    {animal ? 'Update' : 'Add'} Animal
  </button>
</form>
  );
};

export default AnimalForm;
