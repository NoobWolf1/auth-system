const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

const router = express.Router();

// Admin-only routes
router.use(authenticate);
router.use(requireRole(['Admin']));

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;