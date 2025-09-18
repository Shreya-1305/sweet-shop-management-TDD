const express = require("express");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

// User routes
app.use("/api/auth", authRoutes);
// Global error handler
app.use(errorHandler);

module.exports = app;
