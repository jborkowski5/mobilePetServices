// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import About from './About';
import Services from './Services';
import BookAppointment from './BookAppointment';
import Login from './Login';
import Profile from './Profile';
import Navbar from './Navbar';
import AuthRoute from './AuthRoute'; // Import AuthRoute component
import Register from './Register';

function App() {
  return (
    <Router> {/* Wrap your entire application with BrowserRouter */}
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/book-appointment" component={BookAppointment} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <AuthRoute path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
