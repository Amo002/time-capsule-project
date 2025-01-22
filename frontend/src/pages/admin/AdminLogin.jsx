import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/main/userLogin.css";
import MainLayout from "../../layouts/main/MainLayout";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });
  
      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify({ ...response.data.admin, role: 'admin' }));
  
        setMessage("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        setMessage(response.data.error || "Admin login failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error connecting to the server.";
      setMessage(errorMessage);
    }
  };
  

  return (
    <MainLayout>
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </MainLayout>
  );
};

export default UserLogin;
