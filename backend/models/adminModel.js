import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const adminLogin = async (email, password) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return { success: false, error: "Admin not found" };
    }

    const admin = rows[0];

    if (admin.role_id !== 1) {
      return { success: false, error: "Not authorized as admin" };
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return { success: false, error: "Incorrect password" };
    }

    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role_id: admin.role_id,
        profile_picture: admin.profile_picture,
      },
    };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
};

export const fetchUsers = async () => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    return users;
  } catch (error) {
    throw new Error("Database error");
  }
};

export const userDelete = async (userId) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);
    return result;
  } catch (error) {
    throw new Error("Database error");
  }
};

export const userUpdate = async (id, username, email, role_id) => {
  try {
    const timestamp = new Date(); 
    const [result] = await pool.query(
      "UPDATE users SET username = ?, email = ?, role_id = ?, updated_at = ? WHERE id = ?",
      [username, email, role_id, timestamp, id]
    );
    return result;
  } catch (error) {
    throw new Error("Database error");
  }
};