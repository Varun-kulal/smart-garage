const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  estimatedDuration: {
    type: String, // e.g. "2 hours", "1 day"
    required: [true, 'Estimated duration is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['Routine Maintenance', 'Engine Repair', 'Electrical', 'Brakes & Suspension', 'Tires & Wheels', 'Diagnostics', 'AC & Heating', 'General Service'],
    default: 'General Service'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema, 'services');
