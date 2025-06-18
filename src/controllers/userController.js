// src/controllers/userController.js

const { User, Role } = require('../models');
const { AppError } = require('../utils/errors');
const logger = require('../utils/logger'); // Import logger for better error insights

class UserController {
  /**
   * Get the profile of the authenticated user.
   * Accessible by any authenticated user.
   * @param {object} req - The request object, containing req.user from authentication middleware.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async getProfile(req, res, next) {
    try {
      // req.user is populated by the authenticate middleware
      // We explicitly select attributes and include roles to control output
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description', 'permissions'],
          through: { attributes: [] }, // Exclude join table attributes
        }],
      });

      if (!user) {
        // This case should ideally not happen if authenticate middleware works correctly
        throw new AppError('User profile not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User profile fetched successfully',
        data: user,
      });
    } catch (error) {
      logger.error(`Error fetching user profile for user ${req.user ? req.user.id : 'N/A'}:`, error);
      next(error);
    }
  }

  /**
   * Update the profile of the authenticated user.
   * Accessible by any authenticated user.
   * Allows updating firstName and lastName. Email and password handled elsewhere.
   * @param {object} req - The request object, containing req.user and body for updates.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName } = req.body; // Only allow updating these fields

      // Find the user by ID from the authenticated request
      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw new AppError('User not found for update', 404);
      }

      // Update user details
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;

      await user.save(); // Save changes to the database

      // Re-fetch with roles to return a consistent user object
      const updatedUser = await User.findByPk(user.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description', 'permissions'],
          through: { attributes: [] },
        }],
      });

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      logger.error(`Error updating user profile for user ${req.user ? req.user.id : 'N/A'}:`, error);
      next(error);
    }
  }
}

module.exports = new UserController();
