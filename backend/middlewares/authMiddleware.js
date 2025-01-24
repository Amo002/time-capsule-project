import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized access. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token." });
  }
};

export const adminAuthMiddleware = (req, res, next) => {
  if (!req.user || req.user.role_id !== 1) {
    return res
      .status(403)
      .json({ success: false, error: "Access denied. Admins only." });
  }
  next();
};
