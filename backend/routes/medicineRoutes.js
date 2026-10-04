const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicine);
router.post('/save', verifyToken, medicineController.addOrUpdateMedicine);
router.delete('/:id', verifyToken, medicineController.deleteMedicine);

module.exports = router;
