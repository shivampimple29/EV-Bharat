const jwt        = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "evbharat_secret_key";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token. Access denied." });
    }
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.status === "banned")    return res.status(403).json({ message: "Account banned." });
    if (decoded.status === "suspended") return res.status(403).json({ message: "Account suspended." });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only." });
  next();
};

const stationOwnerOnly = (req, res, next) => {
  if (req.user.role !== "station_owner" && req.user.role !== "admin")
    return res.status(403).json({ message: "Station owner access only." });
  next();
};

module.exports = { protect, adminOnly, stationOwnerOnly };
