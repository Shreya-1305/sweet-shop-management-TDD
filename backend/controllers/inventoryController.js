const Sweet = require("../models/sweetModel");

exports.purchaseSweet = async (req, res) => {
  const sweetId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  try {
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) return res.status(404).json({ error: "Sweet not found" });

    const updatedSweet = await Sweet.findByIdAndUpdate(
      sweetId,
      { quantity: sweet.quantity - quantity },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Purchase successful", sweet: updatedSweet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
