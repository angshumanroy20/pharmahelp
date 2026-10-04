const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/admin-status', authController.getAdminStatus);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getMe);
router.get('/users', verifyToken, authController.getAllUsers);
router.put('/users/:id/role', verifyToken, authController.updateUserRole);

module.exports = router;