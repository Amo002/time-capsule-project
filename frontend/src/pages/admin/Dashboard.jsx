import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/admin/AdminLayout";
import "../../styles/admin/dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("manageUsers");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: ""});
  const [modalMessage, setModalMessage] = useState({ text: "", type: "" }); // Updated to hold type
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const defaultProfilePicture = "http://localhost:5000/default/default-profile.jpg";


  useEffect(() => {
    if (activeTab === "manageUsers") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        "http://localhost:5000/api/admin/fetchUsers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setMessage({ text: "Unexpected API response." });
        setUsers([]);
      }
    } catch (error) {
      setMessage({ text: "Error fetching users."});
      setUsers([]);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.delete(
        `http://localhost:5000/api/admin/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchUsers();
        setMessage({ text: "User deleted successfully!"});
        setTimeout(() => {
          setMessage({ text: ""});
        }, 3000);
      } else {
        setMessage({
          text: response.data.error || "Failed to delete the user.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while deleting the user.",
        type: "error",
      });
    }
  };

  const handleUpdateUser = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `http://localhost:5000/api/admin/updateUser/${editUser.id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalMessage({
          text: "User updated successfully!",
          type: "success",
        });
        fetchUsers();
        setTimeout(() => {
          setModalMessage({ text: "" });
          setShowModal(false);
        }, 3000);
      } else {
        setModalMessage({
          text: response.data.error || "Failed to update the user."
        });
      }
    } catch (error) {
      setModalMessage({
        text: "An error occurred while updating the user."
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "/admin-login";
  };

  return (
    <AdminLayout handleLogout={handleLogout}>
      <div className="admin-dashboard">
        {message.text && (
          <div className={`message-box ${message.type}`}>{message.text}</div>
        )}

        <div className="cards-container">
          <div
            className={`card ${activeTab === "manageUsers" ? "active" : ""}`}
            onClick={() => setActiveTab("manageUsers")}
          >
            Manage Users
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
                          src={
                            user.profile_picture ||
                            defaultProfilePicture
                          }
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
                          onClick={() => handleUpdateUser(user)}
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
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update User</h2>
            <form onSubmit={handleSubmitUpdate}>
              <label>
                Name:
                <input
                  type="text"
                  name="username"
                  value={editUser.username}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Role:
                <select
                  name="role_id"
                  value={editUser.role_id}
                  onChange={handleChange}
                >
                  <option value="1">Admin</option>
                  <option value="2">User</option>
                </select>
              </label>
              <button type="submit" className="save-button">
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {modalMessage.text && (
                <div className={`modelMessage ${modalMessage.type}`}>
                  {modalMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
