import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Make an API call to your Flask backend
        fetch('http://127.0.0.1:8080/') // Replace with your actual endpoint
            .then(response => response.json())
            .then(result => {
                // Update state with the data received from the backend
                setData(result);
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching data:', error);
            });
    }, []); // Empty dependency array ensures this effect runs once on component mount

    return (
        <div>
            <h1>Home Page</h1>
            {data ? (
                <div>
                    <h2>Data from Backend:</h2>
                    <p>{/* Render specific data received from the backend */}</p>
                    {/* You can access specific properties from 'data' and display them here */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default HomePage;
