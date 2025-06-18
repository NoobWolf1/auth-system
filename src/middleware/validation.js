// src/middleware/validation.js

const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errors'); // Import your custom error class

/**
 * Middleware to handle validation results from express-validator.
 * If validation errors exist, it throws an AppError with status 400 (Bad Request).
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
const validateRequest = (req, res, next) => {
  // Collect validation errors from the request
  const errors = validationResult(req);

  // If there are validation errors, format them and throw an AppError
  if (!errors.isEmpty()) {
    // Map errors to a more user-friendly format (optional, but good practice)
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    
    // Throw an AppError, which will be caught by the global error handler
    throw new AppError('Validation failed', 400, true, formattedErrors);
  }

  // If no validation errors, proceed to the next middleware/route handler
  next();
};

module.exports = {
  validateRequest,
};
