const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicine);
// router.post('/add', verifyToken, medicineController.addMedicine); // only authenticated

// module.exports = router;




// router.get('/', verifyToken, medicineController.getMedicines);
router.post('/save', verifyToken, medicineController.addOrUpdateMedicine);
// router.post('/save', verifyToken, medicineController.saveMedicine);


module.exports = router;
