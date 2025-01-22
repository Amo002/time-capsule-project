import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate("/"); 
    }
  }, [navigate]);

  return children;
};

export default RedirectIfAuthenticated;
