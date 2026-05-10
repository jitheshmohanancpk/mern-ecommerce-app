const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getSingleProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. എല്ലാവർക്കും കാണാൻ പറ്റുന്ന റൂട്ടുകൾ (Public Routes)
router.get('/', getProducts);
router.get('/:id', getSingleProduct);

// 2. അഡ്മിന് മാത്രം ചെയ്യാൻ പറ്റുന്ന റൂട്ടുകൾ (Admin Routes)
router.post('/admin/new', protect, admin, createProduct);

router.route('/admin/:id')
    .put(protect, admin, updateProduct)    // Update ചെയ്യാൻ
    .delete(protect, admin, deleteProduct); // Delete ചെയ്യാൻ

module.exports = router;