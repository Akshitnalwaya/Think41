const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
    
    return res.status(statusCode).json({
      success: false,
      error: message,
      details: errors
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Resource already exists';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} must be unique`,
      value: error.value
    }));
    
    return res.status(statusCode).json({
      success: false,
      error: message,
      details: errors
    });
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to related resource';
    
    return res.status(statusCode).json({
      success: false,
      error: message,
      details: 'The referenced resource does not exist'
    });
  }

  // Handle Sequelize database connection errors
  if (err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    message = 'Database connection error';
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    statusCode = 400;
    message = 'Validation Error';
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
    
    return res.status(statusCode).json({
      success: false,
      error: message,
      details: errors
    });
  }

  // Log error for debugging (except validation errors)
  if (statusCode >= 500) {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 