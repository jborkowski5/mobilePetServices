// UserInfo.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '././AuthContext'; // Update the path as needed
import AnimalList from './AnimalList';
import AnimalForm from './AnimalForm';

const UserInfo = () => {
    const { isLoggedIn } = useAuth(); // Get the isLoggedIn state from AuthContext

    const [userInfo, setUserInfo] = useState(null);
    const [userAnimals, setUserAnimals] = useState([]);
    const [showAnimalForm, setShowAnimalForm] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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
        if (isLoggedIn) {
            fetchUserInformation();
            fetchUserAnimals();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <p>Please log in to view user information.</p>; // Render a message for non-logged-in users
    }

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
                location.reload();
            } else {
                const errorMessage = await response.json();
                console.error('Failed to add new animal:', errorMessage.message);

            }
        } catch (error) {
            console.error('Error occurred while adding new animal:', error);

        }
    };

    const handleDeleteAnimal = async (animalId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this animal?');

            if (confirmDelete) {
            try {
                const response = await fetch(`/users/${userInfo.id}/animals/${animalId}`, {
                method: 'DELETE',
                });
                if (response.ok) {
                console.log('Animal deleted successfully');
                fetchUserInformation();
                location.reload();
                } else {
                const errorMessage = await response.json();
                console.error('Failed to delete animal:', errorMessage.message);
                }
            } catch (error) {
                console.error('Error occurred while deleting animal:', error);
            }
            }
        };

        const headingStyle = {
            marginBottom: '20px',
            color: '#ff00b5', // Kept heading color as hot pink
            fontSize: '24px', // Set font size for headings
        };
        
        const paragraphStyle = {
            marginBottom: '10px',
            color: '#000', // Changed paragraph text color to black
        };
        
        const linkStyle = {
            color: '#ff00b5',
        };
        
        const buttonStyle = {
            marginTop: '10px',
            padding: '12px 20px', // Increased padding for a larger button
            backgroundColor: 'transparent',
            color: '#ff00b5',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 'bold', // Making the text bold
            fontSize: '16px', // Increased font size
            ...(isHovered && {
            textDecoration: 'none', 
            color: '#ff0077',
            }),
        };

        const containerStyle = {
            padding: '20px',
            backgroundColor: '#fff', // Changed background color to white
            color: '#000', // Changed text color to black
            textAlign: 'center',
            marginTop: '50px', // Added margin top for spacing
        };
    
            const loginMessageStyle = {
            color: '#ff00b5', // Heading color as hot pink
            fontSize: '24px', // Set font size for heading
        };      

    return (
        <div className="user-info-container">
            <h2 style={headingStyle}>User Information</h2>
            {userInfo ? (
                <div>
                    <p style={paragraphStyle}>Name: {userInfo.name}</p>
                    <p style={paragraphStyle}>Username: {userInfo.username}</p>
                    <p style={paragraphStyle}>Address: {userInfo.address}</p>
                    <p style={paragraphStyle}>Phone Number: {userInfo.phone_number}</p>
                    <p style={paragraphStyle}>Email: {userInfo.email}</p>
                    <a style={linkStyle}href="/change_password">Change Password</a>
                    
                    {/* Displays AnimalList component if userAnimals data is available */}
                    {userAnimals.length > 0 && (
                        <AnimalList
                            animals={userAnimals}
                            onDelete={handleDeleteAnimal} 
                        />
                    )}

                    <button
                        style={buttonStyle}
                        onClick={() => setShowAnimalForm(!showAnimalForm)}
                        onMouseOver={() => setIsHovered(true)}
                        onMouseOut={() => setIsHovered(false)}
                    >

                        {showAnimalForm ? 'Hide' : 'New'} Animal Form
                        
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