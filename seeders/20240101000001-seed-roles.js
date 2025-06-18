const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      {
        id: uuidv4(),
        name: 'Admin',
        description: 'Full system access',
        permissions: ['user:read', 'user:write', 'user:delete', 'role:manage'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Legal',
        description: 'Legal department access',
        permissions: ['user:read', 'legal:read', 'legal:write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'PM',
        description: 'Project Manager access',
        permissions: ['user:read', 'project:read', 'project:write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Sales',
        description: 'Sales department access',
        permissions: ['user:read', 'sales:read', 'sales:write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('roles', roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};