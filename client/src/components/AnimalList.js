// USERanimalList.js

import React from 'react';

const AnimalList = ({ animals,  onDelete }) => {
    return (
        <div>
            <h3>Animals</h3>
            <ul>
                {animals.map((animal) => (
                    <li key={animal.id}>
                        <p>Name: {animal.name}</p>
                        <p>Type: {animal.type}</p>
                        <p>Breed: {animal.breed}</p>
                        <p>Weight: {animal.weight}</p>
                        <p>Temperament: {animal.temperament}</p>
                        <button onClick={() => onDelete(animal.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnimalList;
