const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const authService = require('../services/authService');
const { AppError } = require('../utils/error');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

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

      // Assign default role (e.g., 'Sales')
      const defaultRole = await Role.findOne({ where: { name: 'Sales' } });
      if (defaultRole) {
        await user.addRole(defaultRole);
      }

      // Generate tokens
      const tokens = authService.generateTokens(user.id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
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