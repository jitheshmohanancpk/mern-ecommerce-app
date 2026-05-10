const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// /api/orders എന്ന ബേസ് URL-ൽ നിന്നുള്ള റൂട്ടുകൾ
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;