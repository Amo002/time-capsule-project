import {
  fetchCapsuleById,
  updateCapsuleById,
  deleteCapsuleById,
  allCapsulesFetch,
} from "../models/capsuleModel.js";
import multer from "multer";
import path from "path";

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
});

export const getCapsule = async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const loggedInUserId = req.user.id;

    const capsule = await fetchCapsuleById(capsuleId);

    if (!capsule) {
      return res
        .status(404)
        .json({ success: false, message: "Capsule not found" });
    }

    const releaseDate = new Date(capsule.release_date).getTime();
    const currentTime = Date.now();

    if (loggedInUserId === capsule.user_id || currentTime >= releaseDate) {
      return res.status(200).json({ success: true, capsule });
    }

    return res.status(200).json({
      success: true,
      capsule: {
        id: capsule.id,
        title: capsule.title,
        release_date: capsule.release_date,
      },
    });
  } catch (error) {
    console.error("Error fetching capsule:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updateCapsule = (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err.message);
      return res
        .status(400)
        .json({ success: false, message: "Error uploading file." });
    }

    try {
      const { capsuleId } = req.params;
      const { title, content, release_date } = req.body;
      const image_url = req.file ? req.file.filename : null;

      console.log("Incoming capsuleId:", capsuleId);
      console.log("Payload received:", {
        title,
        content,
        release_date,
        image_url,
      });

      const updated = await updateCapsuleById(capsuleId, {
        title,
        content,
        release_date,
        image_url,
      });

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Capsule not found." });
      }

      res
        .status(200)
        .json({ success: true, message: "Capsule updated successfully." });
    } catch (error) {
      console.error("Error updating capsule:", error.message);
      res.status(500).json({ success: false, error: "Server error" });
    }
  });
};

export const deleteCapsule = async (req, res) => {
  try {
    const { capsuleId } = req.params;

    const deleted = await deleteCapsuleById(capsuleId);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Capsule not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Capsule deleted successfully." });
  } catch (error) {
    console.error("Error deleting capsule:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const fetchAllCapsules = async (req, res) => {
  try {
    const capsules = await allCapsulesFetch();

    if (!capsules || capsules.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No capsules found" });
    }

    const formattedCapsules = capsules.map((capsule) => ({
      id: capsule.id,
      title: capsule.title,
      release_date: capsule.release_date,
    }));

    return res.status(200).json({
      success: true,
      capsules: formattedCapsules,
    });
  } catch (error) {
    console.error("Error fetching capsules:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
