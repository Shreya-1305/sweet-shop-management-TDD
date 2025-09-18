// jest.setup.js
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

// Optionally, suppress console.error during tests
jest.spyOn(console, "error").mockImplementation(() => {});
