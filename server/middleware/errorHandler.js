// server/middleware/errorHandler.js

// Error handler middleware placeholder

module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};
