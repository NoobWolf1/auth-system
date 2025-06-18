const { AppError } = require('../utils/errors');

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const userRoles = req.user.roles.map(role => role.name);
      const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const userPermissions = req.user.roles.reduce((acc, role) => {
        return acc.concat(role.permissions || []);
      }, []);

      if (!userPermissions.includes(permission)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requireRole,
  requirePermission,
};