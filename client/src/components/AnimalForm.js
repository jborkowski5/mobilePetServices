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

    // Check if weight is not negative
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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <select
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
      <input
        type="text"
        placeholder="Breed (Dogs Only)"
        name="breed"
        value={formData.breed}
        onChange={handleChange}
      />
      <div>
        <label htmlFor="weight">Weight</label>
        <input
          type="number"
          placeholder="Weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          step="1"
          id="weight"
        />
      </div>
      <div>
        <label htmlFor="temperament">Temperament</label>
        <select
          name="temperament"
          value={formData.temperament}
          onChange={handleChange}
          id="temperament"
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
      <button type="submit">{animal ? 'Update' : 'Add'} Animal</button>
    </form>
  );
};

export default AnimalForm;
