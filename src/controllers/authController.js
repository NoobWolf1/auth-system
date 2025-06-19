const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const authService = require('../services/authService');
const { AppError } = require('../utils/error');
const { ALLOWED_SELF_ASSIGN_ROLES } = require('../middleware/authValidators'); // Import allowed roles

class AuthController {
  async register(req, res, next) {
    try {
      // Destructure 'role' along with other user details
      const { email, password, firstName, lastName, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('User already exists with this email', 409);
      }

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
      });

      // --- Role Assignment Logic ---
      let assignedRole = null;
      if (role && ALLOWED_SELF_ASSIGN_ROLES.includes(role)) {
        // If a valid, self-assignable role is provided, find and assign it
        assignedRole = await Role.findOne({ where: { name: role } });
      } else {
        // Otherwise, assign the default 'Sales' role
        assignedRole = await Role.findOne({ where: { name: 'Sales' } });
      }

      if (assignedRole) {
        await user.addRole(assignedRole);
      } else {
        // This case should ideally not happen if 'Sales' role is seeded
        // and ALLOWED_SELF_ASSIGN_ROLES are correctly defined.
        console.warn('Default role (Sales) not found during user registration!');
      }
      // --- End Role Assignment Logic ---

      // Generate tokens
      const tokens = authService.generateTokens(user.id);

      // Re-fetch user with roles to include in the response
      const registeredUserWithRoles = await User.findByPk(user.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description', 'permissions'],
          through: { attributes: [] },
        }],
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: registeredUserWithRoles, // Return user with assigned roles
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user with roles
      const user = await User.findOne({
        where: { email, isActive: true },
        include: [{
          model: Role,
          as: 'roles',
          through: { attributes: [] },
        }],
      });

      if (!user || !(await user.validatePassword(password))) {
        throw new AppError('Invalid credentials', 401);
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const tokens = authService.generateTokens(user.id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      const tokens = await authService.refreshTokens(refreshToken);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // In a production app, you'd add the token to a blacklist
      // For now, we'll just send a success response
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
