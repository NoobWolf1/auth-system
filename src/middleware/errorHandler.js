const { AppError } = require('../utils/error');
const logger = require('../utils/logger');

const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(error => ({
    field: error.path,
    message: error.message,
  }));
  
  return new AppError('Validation failed', 400, true, errors);
};

const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0].path;
  return new AppError(`${field} already exists`, 409);
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(err);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleSequelizeUniqueConstraintError(err);
  }

  // Default to 500 server error
  if (!error.isOperational) {
    error.statusCode = 500;
    error.message = 'Something went wrong';
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = globalErrorHandler;