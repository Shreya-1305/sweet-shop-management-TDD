const express = require("express");
const router = express.Router();
const {
  addSweet,
  getAllSweets,
  searchSweets,
} = require("../controllers/sweetController");

const { protect, restrictTo } = require("../controllers/authController");

// Protected & admin-only route
router.post("/", protect, restrictTo("admin"), addSweet);
router.get("/", protect, getAllSweets);
router.get("/search", protect, searchSweets);

module.exports = router;
