const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

// User routes
app.use("/api/auth", authRoutes);

module.exports = app;
