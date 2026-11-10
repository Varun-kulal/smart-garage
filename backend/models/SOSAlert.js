const mongoose = require('mongoose');

const SOSAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
    exactLocation: { type: String }
  },
  status: {
    type: String,
    enum: ['Pending', 'Dispatched', 'Resolved'],
    default: 'Pending'
  },
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage' // The garage handling the SOS
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Tow truck driver or mechanic
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SOSAlert', SOSAlertSchema);
