import React, { useState } from 'react';
import axios from 'axios';
import '../styles/adminLogin.css'; // Import admin login styles

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin-login', {
        email,
        password,
      });

      if (response.data.success) {
        setMessage('Admin login successful!');
        // Redirect to admin dashboard (e.g., navigate('/admin-dashboard'))
      } else {
        setMessage(response.data.error || 'Admin login failed.');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="login-container admin-style">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminLogin;
