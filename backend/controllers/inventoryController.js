const Sweet = require("../models/sweetModel");
const sendError = require("../utils/sendError");

exports.purchaseSweet = async (req, res) => {
  const sweetId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return sendError(res, 400, "Invalid quantity");
  }

  try {
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return sendError(res, 404, "Sweet not found");
    }

    if (quantity > sweet.quantity) {
      return sendError(res, 400, "Insufficient stock");
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
      sweetId,
      { quantity: sweet.quantity - quantity },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Purchase successful", sweet: updatedSweet });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error");
  }
};
