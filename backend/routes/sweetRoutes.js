const express = require("express");
const router = express.Router();
const { addSweet, getAllSweets } = require("../controllers/sweetController");

const { protect, restrictTo } = require("../controllers/authController");

// Protected & admin-only route
router.post("/", protect, restrictTo("admin"), addSweet);
router.get("/", protect, getAllSweets);

module.exports = router;
