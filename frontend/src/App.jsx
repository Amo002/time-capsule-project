import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "./pages/main/UserLogin";
import Register from "./pages/main/Register";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/main/Home";
import Profile from "./pages/main/Profile";
import RedirectIfAuthenticated from "./hoc/RedirectIfAuthenticated";
import RequireAdminAuth from "./hoc/RequireAdminAuth";
import RequireUserAuth from "./hoc/RequireUserAuth";
import NotFound from "./pages/NotFound";
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
        <Route
          path="/admin-login"
          element={
            <RedirectIfAuthenticated>
              <AdminLogin />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminAuth>
              <Dashboard />
            </RequireAdminAuth>
          }
        />
        <Route path = "profile/:userId" element={
          <RequireUserAuth>
            <Profile />
          </RequireUserAuth>
        }/>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
