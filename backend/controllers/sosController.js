const SOSAlert = require('../models/SOSAlert');
const Garage = require('../models/Garage');

// @desc    Create a new SOS Alert
// @route   POST /api/sos
// @access  Private (User)
exports.createSOS = async (req, res) => {
  try {
    const { vehicleId, garageId, location, notes } = req.body;
    
    // If frontend didn't send a garageId, fallback to a default one
    let targetGarageId = garageId;
    if (!targetGarageId) {
      const garage = await Garage.findOne({});
      targetGarageId = garage ? garage._id : null;
    }

    const alert = await SOSAlert.create({
      user: req.user._id,
      vehicle: vehicleId || null,
      location,
      notes,
      garage: targetGarageId
    });

    const populatedAlert = await SOSAlert.findById(alert._id)
      .populate('user', 'name phone email')
      .populate('vehicle', 'make model licensePlate')
      .populate('garage', 'name location');

    // Broadcast to admins & garage staff
    if (req.io) {
      req.io.emit('new_sos_alert', populatedAlert);
    }

    res.status(201).json({ success: true, data: populatedAlert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active SOS alerts
// @route   GET /api/sos
// @access  Private (Admin/Staff)
exports.getSOSAlerts = async (req, res) => {
  try {
    const isAdmin = req.role === 'admin';
    const isStaff = req.role === 'staff' || req.role === 'mechanic';
    
    let query = { status: { $ne: 'Resolved' } }; // active alerts
    
    // If staff, only see alerts assigned to their garage
    if (isStaff && req.user.assignedGarage) {
      query.garage = req.user.assignedGarage;
    }

    const alerts = await SOSAlert.find(query)
      .populate('user', 'name phone')
      .populate('vehicle', 'make model licensePlate')
      .populate('assignedStaff', 'name phone')
      .populate('garage', 'name location')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update SOS status
// @route   PUT /api/sos/:id/status
// @access  Private (Admin/Staff)
exports.updateSOSStatus = async (req, res) => {
  try {
    const { status, assignedStaff, notes } = req.body;
    
    let alert = await SOSAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    if (status) alert.status = status;
    if (assignedStaff) alert.assignedStaff = assignedStaff;
    if (notes) alert.notes = notes;

    await alert.save();

    const populatedAlert = await SOSAlert.findById(alert._id)
      .populate('user', 'name phone')
      .populate('vehicle', 'make model licensePlate')
      .populate('assignedStaff', 'name phone')
      .populate('garage', 'name location');

    // Notify user that their SOS was updated
    if (req.io) {
      req.io.emit(`sos_update_${alert.user.toString()}`, populatedAlert);
      req.io.emit('sos_status_changed', populatedAlert); // for admin dashboard refresh
    }

    res.json({ success: true, data: populatedAlert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
