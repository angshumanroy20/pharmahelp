const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const doctorController = require('../controllers/doctorController');

// Get all reported side effects
router.get('/side-effects', verifyToken, doctorController.getSideEffects);

// Verify & reply to a side effect
router.put('/side-effects/:id/verify', verifyToken, doctorController.verifyAndReply);

router.get('/test', (req, res) => {
    console.log('Doctor route /test hit');
    res.send('Doctor route is working');
  });
  

module.exports = router;
