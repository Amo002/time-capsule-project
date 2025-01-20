import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login status
  const [userName, setUserName] = useState('John Doe'); // Simulate user's name

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      // Redirect guests to login
      window.location.href = '/user-login';
    } else {
      // Redirect logged-in users to profile
      window.location.href = '/profile';
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-link brand">
            Time Capsule
          </Link>
        </div>
        <div className="nav-right">
          {isLoggedIn ? (
            <span className="user-name">{userName}</span>
          ) : (
            <Link to="/user-login" className="nav-link">
              Login
            </Link>
          )}
          <button className="profile-button" onClick={handleProfileClick}>
            Profile
          </button>
        </div>
      </nav>
      <div className="content">
        <h1>Welcome to Time Capsule</h1>
        <p>Your memories, preserved forever.</p>
      </div>
    </div>
  );
};

export default Home;
