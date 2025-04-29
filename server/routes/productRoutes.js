const express = require('express');
const { addProduct, getProducts, updateProduct, deleteProduct, lowStockProducts, getProductCount, getLowStockCount } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/count', getProductCount);
router.get('/low-stock', protect, lowStockProducts);
router.get('/low-stock/count', getLowStockCount);

// Admin-only routes
router.post('/', protect, adminOnly, addProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
