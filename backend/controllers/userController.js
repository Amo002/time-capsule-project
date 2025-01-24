import { parse } from "dotenv";
import { userLogin, userRegister, fetchCapsules, createCapsule } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userLogin(email, password);

    if (result.success) {
      const user = result.user;

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role_id: user.role_id,
        },
        token,
      });
    }

    if (result.error === "User not found") {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (result.error === "Incorrect password") {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect password" });
    }

    return res.status(400).json({ success: false, error: result.error });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await userRegister(username, email, password);
    if (result.success) {
      res.status(201).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const capsuleFetch = async (req, res) => {
  try {
    const { userId } = req.params;

    const capsules = await fetchCapsules(userId);

    if (!capsules || capsules.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No capsules found" });
    }

    res.status(200).json({ success: true, capsules });
  } catch (error) {
    console.error("Error during fetching capsules:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).single("image");

export const addCapsule = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err.message);
      return res.status(400).json({ success: false, error: err.message });
    }

    try {
      const { userId } = req.params;
      const { title, content, release_date, is_public } = req.body;
      const image_url = req.file ? req.file.filename : null;

      console.log("Capsule Creation Params:", {
        userId,
        title,
        content,
        release_date,
        is_public,
        image_url,
      });

      if (!title || !content || !release_date) {
        return res
          .status(400)
          .json({ success: false, error: "Missing required fields." });
      }

      const newCapsule = await createCapsule(
        userId,
        title,
        content,
        image_url,
        release_date,
        is_public === "true"
      );

      res.status(201).json({ success: true, capsule: newCapsule });
    } catch (error) {
      console.error("Error during capsule creation:", error.message);
      res.status(500).json({ success: false, error: "Database error." });
    }
  });
};
