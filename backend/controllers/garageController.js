const Garage = require('../models/Garage');
const ServiceRequest = require('../models/ServiceRequest');

// @desc    Get all garages
// @route   GET /api/garages
// @access  Private
exports.getGarages = async (req, res) => {
  try {
    const garages = await Garage.find().sort({ name: 1 });
    res.json({ success: true, count: garages.length, data: garages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new garage
// @route   POST /api/garages
// @access  Private (Admin only)
exports.createGarage = async (req, res) => {
  const { name, location } = req.body;

  // Validation
  if (!name || name.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Garage name must be at least 3 characters long' });
  }
  if (!location || location.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Garage location must be at least 5 characters long' });
  }

  try {
    const garageExists = await Garage.findOne({ name });
    if (garageExists) {
      return res.status(400).json({ success: false, message: 'Garage with this name already exists' });
    }

    const garage = await Garage.create({ name, location });
    res.status(201).json({ success: true, data: garage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update garage live tracking
// @route   PUT /api/garages/:id/tracking
// @access  Private (Admin only)
exports.updateGarageTracking = async (req, res) => {
  const { latitude, longitude, technicianName, technicianPhone } = req.body;

  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage not found' });
    }

    garage.latitude = latitude !== undefined ? latitude : garage.latitude;
    garage.longitude = longitude !== undefined ? longitude : garage.longitude;
    garage.technicianName = technicianName !== undefined ? technicianName : garage.technicianName;
    garage.technicianPhone = technicianPhone !== undefined ? technicianPhone : garage.technicianPhone;
    garage.isActiveForTracking = latitude !== undefined && longitude !== undefined;

    const updatedGarage = await garage.save();
    res.json({ success: true, data: updatedGarage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active live tracking garages
// @route   GET /api/garages/tracking/active
// @access  Private
exports.getActiveTrackingGarages = async (req, res) => {
  try {
    const garages = await Garage.find({ isActiveForTracking: true })
      .select('name location latitude longitude technicianName technicianPhone isActiveForTracking')
      .sort({ name: 1 });
    res.json({ success: true, count: garages.length, data: garages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for live tracking
// @route   GET /api/garages/tracking/bookings
// @access  Private (Admin only)
exports.getTrackingBookings = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ status: { $in: ['Approved', 'In Progress'] } })
      .populate('user', 'name phone')
      .populate('vehicle')
      .populate('service')
      .populate('garage')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a garage
// @route   DELETE /api/garages/:id
// @access  Private (Admin only)
exports.deleteGarage = async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Garage not found' });
    }

    const associatedBookings = await ServiceRequest.countDocuments({ garage: garage._id });
    if (associatedBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete garage because it has associated service requests.'
      });
    }

    await Garage.findByIdAndDelete(garage._id);
    res.json({ success: true, message: 'Garage location removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
