const express = require("express");
const router = express.Router();
const {
  addSweet,
  getAllSweets,
  searchSweets,
} = require("../controllers/sweetController");

const { protect, restrictTo } = require("../controllers/authController");
const { updateSweet } = require("../controllers/sweetController");

// Protected & admin-only route
router.post("/", protect, restrictTo("admin"), addSweet);
router.get("/", protect, getAllSweets);
router.get("/search", protect, searchSweets);
router.put("/:id", protect, restrictTo("admin"), updateSweet);

module.exports = router;
