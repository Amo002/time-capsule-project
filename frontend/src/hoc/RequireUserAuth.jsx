import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireUserAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user-login");
    }
  }, [navigate]);

  return children;
};

export default RequireUserAuth;
