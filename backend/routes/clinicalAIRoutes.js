const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const clinicalAIController = require('../controllers/clinicalAIController');

router.post('/check-interactions', verifyToken, clinicalAIController.checkDrugInteractions);
router.post('/scan-prescription', verifyToken, clinicalAIController.scanPrescription);

module.exports = router;
