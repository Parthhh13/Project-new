const express = require('express');
const { createSale, getSales } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createSale);
router.get('/', protect, getSales);

module.exports = router; 