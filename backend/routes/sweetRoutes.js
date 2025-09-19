const express = require("express");
const router = express.Router();
const { addSweet } = require("../controllers/sweetController");

const { protect, restrictTo } = require("../controllers/authController");

// Protected & admin-only route
router.post("/", protect, restrictTo("admin"), addSweet);

module.exports = router;
