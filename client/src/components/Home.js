import React from 'react';
import '../Home.css'; 
import workersmiling from '../assets/workersmiling.jpeg'; 
import prettypit from '../assets/prettypit.jpeg'; 

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="welcome-text">Welcome to Community Mobile Pet Services!</h1>
            <p>Log in or Register to get started!</p>
            <div className="image-container">
            <img src={workersmiling} alt="1" className="home-image" />
            <img src={prettypit} alt="2" className="home-image" />
            </div>
        </div>
        );
    };

export default Home;