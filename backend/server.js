require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const mongoose = require("mongoose");
const app = require("./app");

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected...");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
