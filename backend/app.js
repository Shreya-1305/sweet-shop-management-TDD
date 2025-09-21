const express = require("express");
const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");
const cors = require("cors");
const sendError = require("./utils/sendError");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["https://sweet-shop-management-tdd.onrender.com"], // only frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/api/auth", authRoutes);

app.use("/api/sweets", sweetRoutes);

app.use("*", (req, res) => {
  return sendError(res, 404, "Route not found");
});

app.use((err, req, res, next) => {
  sendError(res, err.status || 500, err.message || "Server error");
});

module.exports = app;
