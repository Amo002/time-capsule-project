import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "./pages/main/UserLogin";
import Register from "./pages/main/Register";
import AdminLogin from "./pages/admin/AdminLogin";
import Home from "./pages/main/Home";
import RedirectIfAuthenticated from "./hoc/RedirectIfAuthenticated";
import "./styles/app.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/user-login"
          element={
            <RedirectIfAuthenticated>
              <UserLogin />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
