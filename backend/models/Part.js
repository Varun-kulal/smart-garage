const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Part code is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageData: {
    type: Buffer,
    default: null
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  compatibility: {
    type: String, // e.g. "Toyota Corolla, Honda Civic, universal"
    trim: true,
    default: 'Universal'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Part', PartSchema, 'parts');
