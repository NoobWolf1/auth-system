const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const { Role } = require('../src/models'); // Import Role model to find roles

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Hash passwords for the users
    const adminPassword = await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, 12);
    const regularUserPassword = await bcrypt.hash(process.env.REGULAR_USER_PASSWORD, 12);

    // 2. Find the UUIDs of the roles you want to assign
    // It's important to find them by name as UUIDs change with each seed
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    const salesRole = await Role.findOne({ where: { name: 'Sales' } });
    const pmRole = await Role.findOne({ where: { name: 'PM' } });

    // Handle cases where roles might not be found (though they should be if roles seeder runs first)
    if (!adminRole || !salesRole || !pmRole) {
      console.error('One or more required roles not found. Ensure roles are seeded first!');
      return; // Exit if roles are missing
    }

    // 3. Define the users with their respective roles
    const users = [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: adminPassword, // Hashed password
        firstName: 'System',
        lastName: 'Admin',
        isActive: true,
        lastLogin: null, // Null initially, will update on login
        createdAt: new Date(),
        updatedAt: new Date(),
        // We'll manage roles in UserRoles join table
      },
      {
        id: uuidv4(),
        email: 'user@example.com',
        password: regularUserPassword, // Hashed password
        firstName: 'Regular',
        lastName: 'User',
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        email: 'pm@example.com',
        password: regularUserPassword, // Can use the same hashed password for simplicity
        firstName: 'Project',
        lastName: 'Manager',
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 4. Bulk insert users into the 'users' table
    await queryInterface.bulkInsert('users', users);

    // 5. Link users to roles in the 'UserRoles' join table
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@example.com'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const regularUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'user@example.com'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const pmUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'pm@example.com'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const userRoles = [];

    if (adminUser.length > 0 && adminRole) {
      userRoles.push({
        userId: adminUser[0].id,
        roleId: adminRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    if (regularUser.length > 0 && salesRole) {
      userRoles.push({
        userId: regularUser[0].id,
        roleId: salesRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    if (pmUser.length > 0 && pmRole) {
      userRoles.push({
        userId: pmUser[0].id,
        roleId: pmRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (userRoles.length > 0) {
      await queryInterface.bulkInsert('UserRoles', userRoles);
    } else {
      console.warn('No user-role associations were created. Check user and role existence.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Delete entries from the join table first
    await queryInterface.bulkDelete('UserRoles', null, {});
    // Then delete users
    await queryInterface.bulkDelete('users', null, {});
  },
};