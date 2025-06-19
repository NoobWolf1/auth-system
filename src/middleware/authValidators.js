// src/validators/authValidators.js
const { body } = require('express-validator');

// Define roles that a user can self-assign during registration
const ALLOWED_SELF_ASSIGN_ROLES = ['Sales', 'PM', 'Legal'];

// Validation rules for user registration
const registerValidation = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    // Corrected regex: removed the extra dot after '('
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  // Optional: Role can be provided, but must be one of the allowed roles
  body('role')
    .optional() // The field is optional
    .trim()
    .isIn(ALLOWED_SELF_ASSIGN_ROLES).withMessage(`Role must be one of: ${ALLOWED_SELF_ASSIGN_ROLES.join(', ')}`),
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  ALLOWED_SELF_ASSIGN_ROLES, // Export this for use in controller
};
