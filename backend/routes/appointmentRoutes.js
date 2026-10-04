const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

router.get('/doctors', verifyToken, appointmentController.getDoctors);
router.post('/book', verifyToken, appointmentController.bookAppointment);
router.get('/patient', verifyToken, appointmentController.getPatientAppointments);
router.get('/doctor', verifyToken, appointmentController.getDoctorAppointments);
router.put('/:id', verifyToken, appointmentController.updateAppointment);

module.exports = router;
