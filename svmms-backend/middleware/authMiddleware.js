const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let authHeader = req.headers.authorization;

  

  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // ✅ ADD BEARER IF MISSING (KEY FIX)
  if (!authHeader.startsWith("Bearer ")) {
    authHeader = `Bearer ${authHeader}`;
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};
