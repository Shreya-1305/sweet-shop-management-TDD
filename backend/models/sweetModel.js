const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Milk-based", // e.g., peda, rasgulla
        "Sugar-based", // e.g., jalebi
        "Fried", // e.g., gulab jamun
        "Stuffed", // e.g., modak, gujiya
        "Dry Fruits-based", // e.g., kaju katli
        "Halwa", // e.g., sooji halwa, gajar halwa
        "Barfi", // e.g., plain barfi, pista barfi
        "Ladoo", // e.g., besan ladoo, motichoor ladoo
      ],
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sweet", sweetSchema);
