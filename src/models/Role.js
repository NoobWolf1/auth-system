const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['Admin', 'Legal', 'PM', 'Sales']],
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  }, {
    tableName: 'roles',
  });

  return Role;
};