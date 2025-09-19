const Sweet = require("../models/sweetModel");

const allowedCategories = [
  "Milk-based",
  "Sugar-based",
  "Dry Fruits-based",
  "Fried",
  "Barfi",
  "Other",
];

// Controller: Add sweet (inline all logic)
exports.addSweet = async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");
    const authHeader = req.headers.authorization;

    // Token check
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

    // Only admin can add
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin only" });
    }

    const { name, category, price, quantity } = req.body;

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if (typeof price !== "number" || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ error: "Price and quantity must be numbers" });
    }
    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ error: "Price and quantity cannot be negative" });
    }

    // DB call
    const sweet = await Sweet.create(req.body);
    return res.status(201).json({ sweet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
