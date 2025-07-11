import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log("Token from cookie:", req.cookies.token);

    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
export default verifyToken;