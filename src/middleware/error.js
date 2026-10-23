function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') status = 400;
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  }
  if (err.code === 11000) {
    status = 409;
    message = `Already exists: ${Object.keys(err.keyValue || {}).join(', ')}`;
  }
  if (err.name === 'MulterError') status = 400;

  if (status >= 500) console.error(err);
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
