import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/admin/AdminLayout";
import "../../styles/admin/dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("manageUsers");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (activeTab === "manageUsers") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get("http://localhost:5000/api/admin/fetchUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = (userId) => {
    console.log("Deleting user with ID:", userId);
  };

  const handleUpdateUser = (userId) => {
    console.log("Updating user with ID:", userId);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "/admin-login";
  };

  return (
    <AdminLayout handleLogout={handleLogout}>
      <div className="admin-dashboard">
        <div className="cards-container">
          <div
            className={`card ${activeTab === "manageUsers" ? "active" : ""}`}
            onClick={() => setActiveTab("manageUsers")}
          >
            Manage Users
          </div>
          <div
            className={`card ${activeTab === "manageCapsules" ? "active" : ""}`}
            onClick={() => setActiveTab("manageCapsules")}
          >
            Manage Capsules
          </div>
        </div>

        <div className="content-section">
          {activeTab === "manageUsers" && (
            <div className="users-table">
              <h2>Users</h2>
              <table>
                <thead>
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <img
                          src={user.profile_picture || "/assets/images/default-profile.jpg"}
                          alt="Profile"
                          className="user-profile-picture"
                        />
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role_id === 1 ? "Admin" : "User"}</td>
                      <td>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="action-button update-button"
                          onClick={() => handleUpdateUser(user.id)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "manageCapsules" && (
            <div className="capsules-section">
              <h2>Capsules Management</h2>
              <p>Capsules functionality coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
