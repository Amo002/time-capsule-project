import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist or you don't have access.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
