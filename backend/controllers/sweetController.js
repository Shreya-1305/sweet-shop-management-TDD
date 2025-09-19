const Sweet = require("../models/sweetModel");
const jwt = require("jsonwebtoken");

// Controller: handle adding a new sweet (admin only)
exports.addSweet = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Allow only admins
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin only" });
    }

    const sweet = await Sweet.create(req.body);
    return res.status(201).json({ sweet });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
