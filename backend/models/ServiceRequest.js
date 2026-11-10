const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service type is required']
  },
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage',
    required: [true, 'Garage selection is required']
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time slot is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Waiting for Parts', 'Completed', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  totalCost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  estimatedCompletionTime: {
    type: Date
  },
  serviceImages: [{
    type: String
  }],
  pickupAndDrop: {
    type: Boolean,
    default: false
  },
  pickupAddress: {
    type: String,
    default: ''
  },
  dropAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
