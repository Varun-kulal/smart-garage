const mongoose = require('mongoose');

const PartnershipRequestSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  garageName: {
    type: String,
    required: [true, 'Garage name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  location: {
    type: String,
    required: [true, 'Location/Address is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PartnershipRequest', PartnershipRequestSchema);
