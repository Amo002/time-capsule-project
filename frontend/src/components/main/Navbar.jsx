import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/main/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userToken");

  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData")) || {};
  } catch (error) {
    userData = {};
  }

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAdminDashboardClick = () => {
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/user-login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link brand">
          Time Capsule
        </Link>
      </div>
      <div className="nav-right">
        {!isLoggedIn ? (
          <Link to="/user-login" className="nav-link">
            Login
          </Link>
        ) : (
          <>
            <span className="user-name" onClick={handleProfileClick}>
              Welcome, {userData.username || "User"}
            </span>
            {userData.role_id === 1 && (
              <button
                className="dashboard-button"
                onClick={handleAdminDashboardClick}
              >
                Dashboard
              </button>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
