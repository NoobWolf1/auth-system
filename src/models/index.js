const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

// Import models
const User = require('./User')(sequelize);
const Role = require('./Role')(sequelize);

// Define associations
User.belongsToMany(Role, { 
  through: 'UserRoles', 
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles'
});

Role.belongsToMany(User, { 
  through: 'UserRoles', 
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users'
});

module.exports = {
  sequelize,
  User,
  Role,
};