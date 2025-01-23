import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAdminAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!token || userData.role_id !== 1) {
      navigate("/404");
    }
  }, [navigate]);

  return children;
};

export default RequireAdminAuth;
