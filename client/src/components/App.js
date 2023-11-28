import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import UserInfo from './UserInfo';
import Services from './Services';
import Employees from './Employees';
import AppointmentBooking from './AppointmentBooking'; // Import the AppointmentBooking component

function App() {
  const [userId, setUserId] = useState(null); // State to store user ID

  // Function to set the user ID received from login
  const handleLogin = (userId) => {
    setUserId(userId);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            {/* Links to different functionalities */}
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
            <li>
              <Link to="/user_info">User Info</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/employees">Employees</Link>
            </li>
            <li>
              <Link to="/appointment_booking">Appointment Booking</Link> {/* Add link for Appointment Booking */}
            </li>
          </ul>
        </nav>

        <Switch>
          {/* Routes for different functionalities */}
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
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
