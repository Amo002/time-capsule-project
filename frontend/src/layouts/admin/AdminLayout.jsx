import React from "react";
import Navbar from "../../components/admin/Navbar";
import "../../styles/admin/adminLayout.css";

const AdminLayout = ({ children, handleLogout }) => {
  return (
    <div className="admin-layout">
      <Navbar handleLogout={handleLogout} />
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
