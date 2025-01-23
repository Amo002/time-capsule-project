import express from "express";
import {
  loginAdmin,
  userFetch,
  deleteUser,
  updateUser,
} from "../controllers/adminController.js";
import {
  authMiddleware,
  adminAuthMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/dashboard", authMiddleware, adminAuthMiddleware, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to the admin dashboard." });
});

router.get("/fetchUsers", authMiddleware, adminAuthMiddleware, userFetch);

router.delete("/deleteUser/:id", authMiddleware , adminAuthMiddleware , deleteUser);

router.put("/updateUser/:id", authMiddleware, adminAuthMiddleware, updateUser);

export default router;
