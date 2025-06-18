// src/controllers/adminController.js

const { User, Role } = require('../models');
const { AppError } = require('../utils/errors');
const logger = require('../utils/logger'); // Import logger for better error insights

class AdminController {
  /**
   * Get all users in the system.
   * Accessible only by users with the 'Admin' role.
   * Implements pagination, sorting, and includes user roles.
   * @param {object} req - The request object, with query params for pagination.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt'; // Default sort by creation date
      const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC'; // Default sort order ascending

      const { count, rows: users } = await User.findAndCountAll({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description', 'permissions'],
          through: { attributes: [] },
        }],
        limit: limit,
        offset: offset,
        order: [[sortBy, sortOrder]], // Apply sorting
      });

      res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          users: users,
        },
      });
    } catch (error) {
      logger.error('Error fetching all users by admin:', error);
      next(error);
    }
  }

  /**
   * Get a single user by their ID.
   * Accessible only by users with the 'Admin' role.
   * @param {object} req - The request object, with user ID in params.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description', 'permissions'],
          through: { attributes: [] },
        }],
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      logger.error(`Error fetching user by ID ${req.params.id} by admin:`, error);
      next(error);
    }
  }

  /**
   * Update the active status of a user (e.g., deactivate/reactivate).
   * Accessible only by users with the 'Admin' role.
   * @param {object} req - The request object, with user ID in params and isActive in body.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { isActive } = req.body; // Expecting a boolean here

      if (typeof isActive !== 'boolean') {
        throw new AppError('isActive must be a boolean value', 400);
      }

      const user = await User.findByPk(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      user.isActive = isActive;
      await user.save();

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
        message: `User status updated to ${isActive ? 'active' : 'inactive'}`,
        data: updatedUser,
      });
    } catch (error) {
      logger.error(`Error updating status for user ${req.params.id} by admin:`, error);
      next(error);
    }
  }

  /**
   * Delete a user from the system.
   * Accessible only by users with the 'Admin' role.
   * @param {object} req - The request object, with user ID in params.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await user.destroy(); // Deletes the user

      res.status(204).json({ // 204 No Content for successful deletion
        success: true,
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      logger.error(`Error deleting user ${req.params.id} by admin:`, error);
      next(error);
    }
  }
}

module.exports = new AdminController();
