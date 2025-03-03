import jwt from "jsonwebtoken";
const { verify } = jwt;

const userAuth = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
    if (!token || typeof token !== "string") {
      return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.body.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  };
export default userAuth;