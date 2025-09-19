const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../controllers/authController");
const {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
} = require("../controllers/sweetController");

const {
  purchaseSweet,
  restockSweet,
} = require("../controllers/inventoryController");

// Routes for sweets
router
  .route("/")
  .post(protect, restrictTo("admin"), addSweet) // Admin only: Add a sweet
  .get(protect, getAllSweets); // Protected: Get all sweets

router.route("/search").get(protect, searchSweets); // Protected: Search sweets

router
  .route("/:id")
  .put(protect, restrictTo("admin"), updateSweet) // Admin only: Update sweet
  .delete(protect, restrictTo("admin"), deleteSweet); // Admin only: Delete sweet

router.post("/:id/purchase", protect, purchaseSweet);

module.exports = router;
