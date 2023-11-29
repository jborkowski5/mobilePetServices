import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import UserInfo from './UserInfo';
import Services from './Services';
import Employees from './Employees';
import AppointmentBooking from './AppointmentBooking'; 
import ChangePassword from './ChangePassword'; 
import Home from './Home'; // Import the Home component
import '.././Navbar.css'; // Import the Navbar CSS file
import logo from '../assets/logo.jpeg'; // Import your logo image

function App() {
  const { isLoggedIn, logout } = useAuth(); // Get isLoggedIn and logout from AuthContext

  return (
    <Router>
      <div>
      <nav className="navbar">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" /> {/* Logo linking to home */}
          </Link>
          <ul>
            {/* Links to different functionalities */}
            <li>
              <Link to="/">Home</Link> {/* Link to the home page */}
            </li>
            <li>
              <Link to="/user_info">User Profile</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/employees">Staff</Link>
            </li>
            <li>
              <Link to="/appointment_booking">Appointment</Link>
              {/* Add link for Appointment Booking */}
            </li>
            {!isLoggedIn && ( // Show Login link only if the user is not logged in
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {isLoggedIn && ( // Show Logout link only if the user is logged in
              <li>
                <Link to="/logout" onClick={logout}>Logout</Link>
              </li>
            )}
          </ul>
        </nav>

        <Switch>
          {/* Routes for different functionalities */}
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/change_password">
            <ChangePassword />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/user_info">
            <UserInfo />
          </Route>
          <Route path="/services">
            <Services />
          </Route>
          <Route path="/employees">
            <Employees />
          </Route>
          <Route path="/appointment_booking"> {/* Route for Appointment Booking */}
            <AppointmentBooking />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
