const Sale = require('../models/Sale');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items } = req.body;

        // Verify stock availability and update products
        for (const item of items) {
            const product = await Product.findById(item.product.id).session(session);
            
            if (!product) {
                throw new Error(`Product ${item.product.id} not found`);
            }
            
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            // Update product stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // Create sale record
        const sale = await Sale.create([{
            items: items.map(item => ({
                product: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0),
            user: req.user._id
        }], { session });

        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            data: sale[0]
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({
            success: false,
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('user', 'name')
            .populate('items.product', 'name price');

        res.json({
            success: true,
            data: sales
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createSale,
    getSales
}; 