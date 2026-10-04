const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const reminderController = require('../controllers/reminderController');

router.get('/', verifyToken, reminderController.getReminders);
router.post('/add', verifyToken, reminderController.addReminder);
router.put('/:id/toggle', verifyToken, reminderController.toggleTaken);
router.delete('/:id', verifyToken, reminderController.deleteReminder);

module.exports = router;
