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

    return (
        <div>
            <h2>User Animals</h2>
            <ul>
                {animals.map(animal => (
                    <li key={animal.id}>{animal.name} - {animal.type}</li>
                    // Display other details as needed
                ))}
            </ul>
        </div>
    );
};

export default UserAnimals;
