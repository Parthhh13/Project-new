const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Parthhh13:parth1301@cluster0.sq9ro.mongodb.net/stock-savvy-db?retryWrites=true&w=majority';
    
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
