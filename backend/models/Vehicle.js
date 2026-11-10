const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required'],
  },
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    trim: true,
  },
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Invalid future year'],
  },
  vin: {
    type: String,
    trim: true,
    default: '',
  },
  mileage: {
    type: Number,
    default: 0,
  },
  lastServiceDate: {
    type: Date,
    default: null,
  },
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage',
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema, 'vehicles');
