const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// Handle React routing, return all requests to React app
// Using a more specific approach to avoid path-to-regexp issues
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Catch-all route for all other paths
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// MongoDB Connection URI
const MONGODB_URI = 'mongodb+srv://Parthhh13:parth1301@cluster0.sq9ro.mongodb.net/stock-savvy-db?retryWrites=true&w=majority';

// Connect MongoDB and Start Server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
