const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error');

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      return this.generateTokens(decoded.userId);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}

module.exports = new AuthService();