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

exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    return res.status(200).json({ sweets });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error");
  }
};

exports.searchSweets = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const { name, category, minPrice, maxPrice } = req.query;

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return sendError(res, 400, "Invalid price range");
    }

    const query = {};
    if (name) query.name = { $regex: name, $options: "i" }; // case-insensitive
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    return res.status(200).json({ sweets });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error");
  }
};
