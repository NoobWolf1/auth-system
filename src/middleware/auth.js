const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { AppError } = require('../utils/error');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Access token is required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] },
      }],
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

module.exports = { authenticate };