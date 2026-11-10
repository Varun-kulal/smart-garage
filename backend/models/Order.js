const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
      name: String,
      qty: Number,
      basePrice: Number
    }
  ],
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingDetails: {
    address: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
