const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  part: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Part',
    required: [true, 'Part reference is required'],
    unique: true
  },
  quantityInStock: {
    type: Number,
    required: [true, 'Quantity in stock is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: [true, 'Reorder level is required'],
    min: [0, 'Reorder level cannot be negative'],
    default: 5
  },
  location: {
    type: String,
    trim: true,
    default: 'Main Warehouse'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', InventorySchema);
