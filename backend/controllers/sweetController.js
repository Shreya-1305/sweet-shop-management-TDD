const Sweet = require("../models/sweetModel");
const sendError = require("../utils/sendError");
const allowedCategories = [
  "Milk-based",
  "Sugar-based",
  "Fried",
  "Stuffed",
  "Dry Fruits-based",
  "Halwa",
  "Barfi",
  "Ladoo",
];

// Helper: validate sweet input
const validateSweetInput = ({ name, category, price, quantity }) => {
  if (!name || !category || price === undefined || quantity === undefined) {
    return "All fields are required";
  }
  if (!allowedCategories.includes(category)) {
    return "Invalid category";
  }
  if (typeof price !== "number" || typeof quantity !== "number") {
    return "Price and quantity must be numbers";
  }
  if (price < 0 || quantity < 0) {
    return "Price and quantity cannot be negative";
  }
  return null;
};

exports.addSweet = async (req, res) => {
  try {
    const validationError = validateSweetInput(req.body);
    if (validationError) return sendError(res, 400, validationError);

    const sweet = await Sweet.create(req.body);
    return res.status(201).json({ sweet });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error");
  }
};
