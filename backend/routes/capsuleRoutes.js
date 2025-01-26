import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getCapsule,
  updateCapsule,
  deleteCapsule,
  fetchAllCapsules,
} from "../controllers/capsuleController.js";

const router = express.Router();

router.get("/fetchAllCapsules", fetchAllCapsules);

router.get("/:capsuleId", authMiddleware, getCapsule);
router.put("/:capsuleId", authMiddleware, updateCapsule);
router.delete("/:capsuleId", authMiddleware, deleteCapsule);



export default router;
