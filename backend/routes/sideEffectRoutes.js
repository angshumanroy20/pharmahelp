const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  reportSideEffect,
  getReportsForAdmin,
  replyToReport,verifyAndReply,getAllSideEffects
} = require('../controllers/sideEffectController');

router.get('/all', verifyToken, getAllSideEffects);

router.post('/report', verifyToken, reportSideEffect);
router.get('/all', verifyToken, getReportsForAdmin);
router.put('/reply/:id', verifyToken, replyToReport);
router.put('/:id/verify', verifyToken, verifyAndReply);


module.exports = router;
