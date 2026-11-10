const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const garageRoutes = require('./routes/garageRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const staffRoutes = require('./routes/staffRoutes');
const sosRoutes = require('./routes/sosRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Make io accessible to our router
app.use((req, res, next) => {
  try {
    req.io = require('./socket').getIO();
  } catch (err) {
    // Socket.io might not be initialized yet during early booting
  }
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Map REST API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inventory', inventoryRoutes); // Handles catalog /api/inventory/parts and stock /api/inventory
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/orders', orderRoutes);

// Root route for API verification
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Smart Garage Hub API Server',
    status: 'Running',
    version: '1.0.0'
  });
});

// Fallback for Page Not Found (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
