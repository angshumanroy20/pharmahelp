const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/create', verifyToken, orderController.createOrder);
router.get('/my', verifyToken, orderController.getMyOrders);
router.get('/all', verifyToken, orderController.getAllOrders);
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

module.exports = router;
