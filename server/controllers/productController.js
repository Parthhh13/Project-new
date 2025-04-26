const Product = require('../models/Product');

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, reorderLevel, supplier } = req.body;
    const newProduct = await Product.create({ name, category, price, stock, reorderLevel, supplier });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low-stock products
exports.lowStockProducts = async (req, res) => {
  try {
    const lowStock = await Product.find({ stock: { $lte: 5 } });
    res.status(200).json(lowStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
