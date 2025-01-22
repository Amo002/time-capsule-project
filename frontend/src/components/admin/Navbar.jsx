import React, { useEffect, useState } from "react";
import "../../styles/admin/adminNavbar.css";
import defaultProfilePicture from "../../assets/images/default-profile.jpg";


const Navbar = ({ handleLogout }) => {
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
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
