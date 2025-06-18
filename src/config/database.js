// src/config/database.js

require('dotenv').config(); // Load environment variables from .env file

/**
 * Sequelize database configuration.
 * Uses environment variables for connection details to support different environments
 * (development, production, testing) and Docker containers.
 */
const databaseConfig = {
  // Database dialect (e.g., 'postgres', 'mysql', 'sqlite')
  dialect: process.env.DB_DIALECT || 'postgres',
  
  // Database host (e.g., 'localhost' for local, 'postgres' for Docker service)
  host: process.env.DB_HOST || 'localhost',
  
  // Database port (e.g., 5432 for PostgreSQL)
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  
  // Database name
  database: process.env.DB_NAME || 'auth_system_db',
  
  // Database username
  username: process.env.DB_USERNAME || 'postgres',
  
  // Database password
  password: process.env.DB_PASSWORD || 'your_password', // Local default, overridden by Docker/env
  
  // Logging queries to console (good for development, disable in production)
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Disable operator aliases for security and future compatibility
  define: {
    freezeTableName: true, // Prevents Sequelize from pluralizing table names
  },
  
  // Pool configuration for database connections
  pool: {
    max: 5,     // Maximum number of connection in pool
    min: 0,     // Minimum number of connection in pool
    acquire: 30000, // The maximum time (in ms) that pool will try to get connection before throwing error
    idle: 10000 // The maximum time (in ms) that a connection can be idle before being released
  },
};

module.exports = databaseConfig;
