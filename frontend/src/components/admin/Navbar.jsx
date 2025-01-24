import React, { useEffect, useState } from "react";
import "../../styles/admin/adminNavbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  const defaultProfilePicture = "http://localhost:5000/default/default-profile.jpg";
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profilePicture: defaultProfilePicture,
  });

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData({
        username: storedUserData.username,
        email: storedUserData.email,
        profilePicture: storedUserData.profile_picture || defaultProfilePicture,
      });
    }
  }, []);

  const handleHomePage = () => {
    navigate("/");
  };

  return (
    <div className="admin-navbar">
      <div className="navbar-left">
        <img
          src={userData.profilePicture}
          alt="Profile"
          className="admin-profile-picture"
        />
        <div className="admin-info">
          <h3>{userData.username}</h3>
          <p>{userData.email}</p>
        </div>
      </div>
      <div className="navbar-right">
        <button onClick={handleHomePage} className="homePage-button">
          Home Page
        </button>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
