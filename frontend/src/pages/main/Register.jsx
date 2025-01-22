import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../layouts/main/MainLayout";
import "../../styles/main/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          email,
          password,
        }
      );

      if (response.data.success) {
        setMessage("Registration successful!");
        setTimeout(() => {
          window.location.href = "/user-login";
        }, 2000);
      } else {
        setMessage(response.data.error || "Registration failed.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error connecting to the server.";
      setMessage(errorMessage);
    }
  };

  return (
    <MainLayout>
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </MainLayout>
  );
};

export default Register;
