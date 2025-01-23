import {
  adminLogin,
  fetchUsers,
  userDelete,
  userUpdate,
} from "../models/adminModel.js";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await adminLogin(email, password);
    if (result.success) {
      const token = jwt.sign(
        {
          id: result.user.id,
          email: result.user.email,
          role_id: result.user.role_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        admin: result.user,
        token,
      });
    } else {
      res.status(401).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const userFetch = async (req, res) => {
  try {
    const users = await fetchUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, error: "No users found" });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error during fetching users:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userDelete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error during deleting user:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role_id } = req.body;

  try {
    const result = await userUpdate(id, username, email, role_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error during updating user:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
};
