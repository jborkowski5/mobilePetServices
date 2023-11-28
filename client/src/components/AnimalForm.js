import React, { useState } from 'react';

const AnimalForm = ({ user, animal, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: animal ? animal.name : '',
        type: animal ? animal.type : '',
        breed: animal ? animal.breed : '',
        weight: animal ? animal.weight : '',
        temperament: animal ? animal.temperament : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <input
            type="text"
            placeholder="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
        />
        <input
            type="text"
            placeholder="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
        />
        <input
            type="text"
            placeholder="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
        />
        <input
            type="text"
            placeholder="Temperament"
            name="temperament"
            value={formData.temperament}
            onChange={handleChange}
        />
        <button type="submit">{animal ? 'Update' : 'Add'} Animal</button>
        </form>
    );
};

export default AnimalForm;