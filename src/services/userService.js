// src/services/userService.js

const { User, Role } = require('../models');
const { AppError } = require('../utils/error');
const logger = require('../utils/logger'); // For logging service-level errors

/**
 * This service layer encapsulates business logic related to user management,
 * separating it from controllers to improve maintainability and testability.
 * Controller methods should primarily handle request/response, delegating
 * complex operations to services.
 */
class UserService {
  /**
   * Fetches a user by their ID, optionally including their roles.
   * @param {string} userId - The UUID of the user to fetch.
   * @param {boolean} includeRoles - Whether to include associated roles.
   * @returns {Promise<User|null>} The user object or null if not found.
   */
  async getUserById(userId, includeRoles = false) {
    try {
      const options = {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
      };

      if (includeRoles) {
        options.include = [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description', 'permissions'],
          through: { attributes: [] },
        }];
      }

      const user = await User.findByPk(userId, options);
      return user;
    } catch (error) {
      logger.error(`Error in UserService.getUserById for user ${userId}:`, error);
      throw new AppError('Failed to retrieve user', 500); // Re-throw a generic operational error
    }
  }

  /**
   * Updates a user's details.
   * @param {string} userId - The ID of the user to update.
   * @param {object} updates - An object containing fields to update (e.g., { firstName, lastName, isActive }).
   * @returns {Promise<User>} The updated user object.
   * @throws {AppError} If the user is not found or update fails.
   */
  async updateUser(userId, updates) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Apply updates (ensure only allowed fields are updated)
      if (updates.firstName !== undefined) user.firstName = updates.firstName;
      if (updates.lastName !== undefined) user.lastName = updates.lastName;
      if (updates.isActive !== undefined) user.isActive = updates.isActive;
      // Do NOT allow password or email updates directly via this method without specific flows

      await user.save(); // Persist changes

      // Return the updated user, potentially with roles
      const updatedUser = await this.getUserById(userId, true); // Re-fetch with roles
      return updatedUser;
    } catch (error) {
      logger.error(`Error in UserService.updateUser for user ${userId} with updates ${JSON.stringify(updates)}:`, error);
      // If it's already an AppError, re-throw it, otherwise wrap it
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update user', 500);
    }
  }

  /**
   * Deletes a user.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<boolean>} True if deletion was successful.
   * @throws {AppError} If the user is not found or deletion fails.
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await user.destroy();
      return true;
    } catch (error) {
      logger.error(`Error in UserService.deleteUser for user ${userId}:`, error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete user', 500);
    }
  }

  // Potentially add more complex user-related business logic here,
  // e.g., assigning/removing roles, managing permissions, searching users.
}

module.exports = new UserService();
