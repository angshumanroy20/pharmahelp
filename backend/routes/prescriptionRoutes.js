// const upload = require('../middleware/upload');
// const { uploadPrescription } = require('../controllers/prescriptionController');

// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middleware/authMiddleware');
// router.post('/upload', verifyToken, upload.single('prescription'), uploadPrescription);


// const { getUserPrescriptions } = require('../controllers/prescriptionController');

// router.get('/', verifyToken, getUserPrescriptions);

// module.exports = router;

// const { getAllPrescriptions } = require('../controllers/prescriptionController');

// router.get('/all', verifyToken, getAllPrescriptions);


// const uploadm = require('../middleware/uploadMiddleware');

// const prescriptionController = require('../controllers/prescriptionController');

// router.post('/upload', verifyToken, uploadm.single('file'), prescriptionController.uploadPrescription);
// router.get('/my', verifyToken, prescriptionController.getMyPrescriptions);
// router.post('/verify/:id', verifyToken, prescriptionController.verifyPrescription);

// module.exports = router;


const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // adjust this to point to your multer setup
const prescriptionController = require('../controllers/prescriptionController');

// Patient routes
router.post('/upload', verifyToken, upload.single('file'), prescriptionController.uploadPrescription);
router.get('/my', verifyToken, prescriptionController.getMyPrescriptions);
router.get('/', verifyToken, prescriptionController.getUserPrescriptions);

// Admin/Pharmacist routes
router.get('/all', verifyToken, prescriptionController.getAllPrescriptions);
router.post('/verify/:id', verifyToken, prescriptionController.verifyPrescription);

module.exports = router;
