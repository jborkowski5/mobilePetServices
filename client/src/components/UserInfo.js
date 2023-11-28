// UserInfo.js

import React, { useState, useEffect, useCallback } from 'react';
import AnimalList from './AnimalList';
import AnimalForm from './AnimalForm';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [userAnimals, setUserAnimals] = useState([]);
    const [showAnimalForm, setShowAnimalForm] = useState(false);

    const fetchUserInformation = useCallback(async () => {
        try {
            const response = await fetch('/user_info', {
                method: 'GET',
                credentials: 'include', // Send cookies for authentication
            });

            if (response.ok) {
                const userData = await response.json();
                setUserInfo(userData);
                console.log('Fetched User Information:', userData);
            } else {
                console.error('Failed to fetch user information');
            }
        } catch (error) {
            console.error('Error occurred while fetching user information:', error);
        }
    }, []);

    const fetchUserAnimals = useCallback(async () => {
        try {
            const response = await fetch('/user_animals', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const userAnimalsData = await response.json();
                setUserAnimals(userAnimalsData);
                console.log('Fetched User Animals:', userAnimalsData);
            } else {
                console.error('Failed to fetch user animals');
            }
        } catch (error) {
            console.error('Error occurred while fetching user animals:', error);
        }
    }, []);

    useEffect(() => {
        fetchUserInformation();
        fetchUserAnimals();
    }, [fetchUserInformation, fetchUserAnimals]);

    const handleAddAnimal = async (formData) => {
        try {
            const response = await fetch(`/users/${userInfo.id}/animals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userInfo.id,
                    name: formData.name,
                    type: formData.type,
                    breed: formData.breed,
                    weight: formData.weight,
                    temperament: formData.temperament,
                }),
            });

            if (response.ok) {
                const newAnimal = await response.json();
                console.log('New animal added successfully:', newAnimal);
                fetchUserInformation();
                setShowAnimalForm(false);
            } else {
                const errorMessage = await response.json();
                console.error('Failed to add new animal:', errorMessage.message);

            }
        } catch (error) {
            console.error('Error occurred while adding new animal:', error);

        }
    };

    const handleDeleteAnimal = async (animalId) => {
        try {
            const response = await fetch(`/users/${userInfo.id}/animals/${animalId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Animal deleted successfully');
                fetchUserInformation();
            } else {
                const errorMessage = await response.json();
                console.error('Failed to delete animal:', errorMessage.message);
            }
        } catch (error) {
            console.error('Error occurred while deleting animal:', error);
        }
    };

    return (
        <div>
            <h2>User Information</h2>
            {userInfo ? (
                <div>
                    <p>Name: {userInfo.name}</p>
                    <p>Username: {userInfo.username}</p>
                    <p>Address: {userInfo.address}</p>
                    <p>Phone Number: {userInfo.phone_number}</p>
                    <p>Email: {userInfo.email}</p>
                    
                    {/* Display AnimalList component if userAnimals data is available */}
                    {userAnimals.length > 0 && (
                        <AnimalList
                            animals={userAnimals}
                            onDelete={handleDeleteAnimal} 
                        />
                    )}

                    <button onClick={() => setShowAnimalForm(!showAnimalForm)}>
                        {showAnimalForm ? 'Hide' : 'Add'} Animal Form
                    </button>
                    {showAnimalForm && (
                        <AnimalForm user={userInfo} onSubmit={handleAddAnimal} />
                    )}
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default UserInfo;