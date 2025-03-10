import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const userLogin = async (email, password) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Incorrect password" };
    }
    return { success: true, user };
  } catch (error) {
    console.error("Database error during user login:", error);
    return { success: false, error: "Database error" };
  }
};

export const userRegister = async (username, email, password) => {
  try {
    const [emailCheck] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (emailCheck.length > 0) {
      return { success: false, error: "Email already exists" };
    }

    const [usernameCheck] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (usernameCheck.length > 0) {
      return { success: false, error: "Username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRoleId = 2;

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, role_id, created_at) VALUES (?, ?, ?, ?, NOW())",
      [username, email, hashedPassword, defaultRoleId]
    );

    if (result.affectedRows > 0) {
      return { success: true, message: "User registered successfully" };
    } else {
      return { success: false, error: "Failed to register user" };
    }
  } catch (error) {
    console.error("Database error during user registration:", error);
    return { success: false, error: "Database error" };
  }
};

export const fetchCapsules = async (userId, page = 1, limit = 6) => {
  try {
    const offset = (page - 1) * limit;

    const [capsules] = await pool.query(
      `SELECT id, title, release_date FROM capsules WHERE user_id = ? LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM capsules WHERE user_id = ?`,
      [userId]
    );

    return { capsules, total };
  } catch (error) {
    console.error("Database error during fetching capsules:", error.message);
    throw new Error("Database error");
  }
};

export const createCapsule = async (
  userId,
  title,
  content,
  image_url,
  release_date
) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO capsules (user_id, title, content, image_url, release_date) VALUES (?, ?, ?, ?, ?)",
      [userId, title, content, image_url, release_date]
    );

    const [newCapsule] = await pool.query(
      "SELECT * FROM capsules WHERE id = ?",
      [result.insertId]
    );

    return newCapsule[0];
  } catch (error) {
    console.error("Database error during capsule creation:", error.message);
    throw new Error("Database error");
  }
};

