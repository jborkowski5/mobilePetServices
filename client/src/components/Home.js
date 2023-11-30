import React from 'react';
import '../Home.css'; // Import the Home component CSS file
import workersmiling from '../assets/workersmiling.jpeg'; // Import image1 from assets folder
import prettypit from '../assets/prettypit.jpeg'; 

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="welcome-text">Welcome to Community Mobile Pet Services!</h1>
            <p>This is the home page content.</p>
            <div className="image-container">
            <img src={workersmiling} alt="Image 1" className="home-image" />
            <img src={prettypit} alt="Image 2" className="home-image" />
            </div>
        </div>
        );
    };

export default Home;