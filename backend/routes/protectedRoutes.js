const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/secure-data', verifyToken, (req, res) => {
  res.json({ message: 'This is protected data!', user: req.user });
});

module.exports = router;
