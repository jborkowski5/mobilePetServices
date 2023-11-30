import React from 'react';

const AnimalList = ({ animals, onDelete }) => {
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff', // Changed background color to white
    color: '#000', // Changed text color to black
    textAlign: 'center',
  };

  const headingStyle = {
    marginBottom: '20px',
    color: '#ff00b5', // Kept heading color as hot pink
    fontSize: '24px', // Set font size for headings
  };

  const listItemStyle = {
    marginBottom: '20px',
    border: '1px solid #000', // Added black border around each animal card
    borderRadius: '20px', // Increased border radius for more rounded corners
    padding: '10px', // Added padding for better spacing
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: 'transparent', // Changed button background to clear
    color: '#ff00b5', // Changed button text color to hot pink
    border: '1px solid #ff00b5', // Added a border for visibility
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff00b5',
    color: '#fff', // Changed text color on hover to white
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
