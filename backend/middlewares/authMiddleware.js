import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized access. Token missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach the decoded user data to the request
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(403).json({ success: false, error: 'Invalid or expired token.' });
  }
};
