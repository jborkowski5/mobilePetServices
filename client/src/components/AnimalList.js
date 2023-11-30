import React from 'react';

const AnimalList = ({ animals, onDelete }) => {
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff', 
    color: '#000', 
    textAlign: 'center',
  };

  const headingStyle = {
    marginBottom: '20px',
    color: '#ff00b5', 
    fontSize: '24px', 
  };

  const listItemStyle = {
    marginBottom: '20px',
    border: '1px solid #000', 
    borderRadius: '20px', 
    padding: '10px', 
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: 'transparent', 
    color: '#ff00b5', 
    border: '1px solid #ff00b5', 
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff00b5',
    color: '#fff', 
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>Animals</h3>
      <ul>
        {animals.map((animal) => (
          <li key={animal.id} style={listItemStyle}>
            <p>Name: {animal.name}</p>
            <p>Type: {animal.type}</p>
            <p>Breed: {animal.breed}</p>
            <p>Weight: {animal.weight}</p>
            <p>Temperament: {animal.temperament}</p>
            <button
              style={buttonStyle}
              onClick={() => onDelete(animal.id)}
              onMouseOver={(e) => (e.target.style = buttonHoverStyle)}
              onMouseOut={(e) => (e.target.style = buttonStyle)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimalList;
