import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireAdminAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!token || userData.role !== 'admin') {
      navigate('/404');
    }
    else {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return children;
};

export default RequireAdminAuth;
