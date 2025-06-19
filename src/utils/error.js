class AppError extends Error {
  // Added 'errors' parameter to the constructor
  constructor(message, statusCode = 500, isOperational = true, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Store the errors array if provided
    this.errors = errors; 

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
