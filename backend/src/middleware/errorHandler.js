const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors).map((item) => item.message).join(', '),
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid customer ID' });
  }

  console.error(error);
  res.status(500).json({ success: false, message: 'Server error' });
};

module.exports = errorHandler;
