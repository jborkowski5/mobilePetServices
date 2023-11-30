import React, { useState, useEffect } from 'react';

const UserAnimals = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchAnimals = async () => {
      try {
        const response = await fetch(`/user/${userId}/animals`); // Replace with your API endpoint

        if (response.ok) {
          const animalData = await response.json();
          setAnimals(animalData); // Set the animals state with the fetched data
        } else {
          console.error('Failed to fetch animals:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    if (userId) {
      fetchAnimals();
    }
  }, []);

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
    marginBottom: '10px',
    color: '#000', // Changed list item text color to black
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>User Animals</h2>
      <ul>
        {animals.map((animal) => (
          <li key={animal.id} style={listItemStyle}>
            {animal.name} - {animal.type}
          </li>
          // Display other details as needed
        ))}
      </ul>
    </div>
  );
};

export default UserAnimals;
