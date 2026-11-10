const mongoose = require('mongoose');

const GarageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Garage name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Garage name must be at least 3 characters']
  },
  location: {
    type: String,
    required: [true, 'Garage location is required'],
    trim: true,
    minlength: [5, 'Garage location must be at least 5 characters']
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  isActiveForTracking: {
    type: Boolean,
    default: false
  },
  technicianName: {
    type: String,
    default: ''
  },
  technicianPhone: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Garage', GarageSchema);
