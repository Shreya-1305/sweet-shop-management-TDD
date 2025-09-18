const errorHandler = (err, req, res, next) => {
  console.error(err); // optional: log the error

  if (err.code === 11000) {
    return res.status(400).json({ error: "Email already exists" });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: "Server error" });
};

module.exports = errorHandler;
