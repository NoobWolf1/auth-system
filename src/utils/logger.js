// src/utils/logger.js

const winston = require('winston');
const path = require('path');
require('dotenv').config(); // Ensure environment variables are loaded

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'white',
};

// Add custom colors to Winston
winston.addColors(colors);

// Determine the log level based on environment variable, default to 'info'
const level = process.env.LOG_LEVEL || 'info';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // Allow for different formats based on environment
  process.env.NODE_ENV === 'development'
    ? winston.format.colorize({ all: true }) // Colorize output for development
    : winston.format.uncolorize(), // No colors in production logs
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}` +
      (info.stack ? `\n${info.stack}` : '') // Include stack trace for errors
  )
);

const transports = [
  // Console transport for all environments
  new winston.transports.Console({
    level: level,
    format: winston.format.simple(), // Simple format for console to prevent double timestamp/level
  }),
];

// Add file transports for production and non-development environments
if (process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'), // Path for error logs
      level: 'error', // Only log errors to this file
      format: winston.format.json(), // JSON format for file logs
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'), // Path for combined logs
      level: level, // Log all levels up to the configured level
      format: winston.format.json(), // JSON format for file logs
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: level,
  levels,
  format,
  transports,
  exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger;
