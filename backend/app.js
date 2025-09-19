const express = require("express");
const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/sweets", sweetRoutes);

app.use("*", (req, res) => {
  return sendError(res, 404, "Route not found");
});

app.use((err, req, res, next) => {
  sendError(res, err.status || 500, err.message || "Server error");
});

module.exports = app;
