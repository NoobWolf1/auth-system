// src/utils/helpers.js

/**
 * This file is for general utility functions that can be reused across the application
 * and don't belong to a specific module (e.g., string manipulation, date formatting,
 * simple data transformations, etc.).
 *
 * Currently, it's an empty placeholder, but you can add functions here as needed.
 *
 * Example:
 * function formatCurrency(amount) {
 * return `$${amount.toFixed(2)}`;
 * }
 *
 * module.exports = {
 * formatCurrency,
 * // ... other helper functions
 * };
 */

// Example placeholder for future helper functions
function capitalizeFirstLetter(string) {
  if (!string) return ''; 
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  capitalizeFirstLetter,
  // Add more helper functions as your application grows
};
