import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';
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
              <NavLink exact to="/" activeClassName="active">HOME</NavLink>
            </li>
            <li>
              <NavLink exact to="/services" activeClassName="active">OUR SERVICES</NavLink>
            </li>
            <li>
              <NavLink exact to="/user_info" activeClassName="active">USER PROFILE</NavLink>
            </li>
            <li>
              <NavLink exact to="/employees" activeClassName="active">MEET THE STAFF</NavLink>
            </li>
            <li>
              <NavLink exact to="/appointment_booking" activeClassName="active">BOOK APPOINTMENT</NavLink>
              {/* Add link for Appointment Booking */}
            </li>
            {!isLoggedIn && ( // Show Login link only if the user is not logged in
              <li>
                <NavLink exact to="/login" activeClassName="active">LOGIN</NavLink>
              </li>
            )}
            {isLoggedIn && ( // Show Logout link only if the user is logged in
              <li>
                <NavLink to="/logout" activeClassName="active" onClick={logout}>LOGOUT</NavLink>
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
