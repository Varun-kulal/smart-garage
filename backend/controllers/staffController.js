const ServiceRequest = require('../models/ServiceRequest');

// @desc    Get services assigned to logged-in staff
// @route   GET /api/staff/services
// @access  Private (Staff)
exports.getAssignedServices = async (req, res) => {
  try {
    const isMechanic = req.user.role === 'mechanic';
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    const query = (isAdmin || isStaff) ? (req.user.assignedGarage ? { garage: req.user.assignedGarage } : {}) : { assignedStaff: req.user._id };

    const services = await ServiceRequest.find(query)
      .populate('user', 'name email phone')
      .populate('vehicle', 'make model year licensePlate')
      .populate('service', 'name category price')
      .populate('garage', 'name location')
      .populate('assignedStaff', 'name role')
      .sort({ bookingDate: 1 });

    const garageInfo = req.user.assignedGarage ? await require('../models/Garage').findById(req.user.assignedGarage) : null;
    res.json({ success: true, count: services.length, garageName: garageInfo?.name, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update status of an assigned service
// @route   PUT /api/staff/services/:id/status
// @access  Private (Staff)
exports.updateServiceStatus = async (req, res) => {
  const { status, notes } = req.body;

  try {
    let service = await ServiceRequest.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Ensure staff can only update requests for their garage, or their own requests
    if (req.role !== 'admin' && req.role !== 'staff') {
      const isAssignedToGarage = req.user.assignedGarage && req.user.assignedGarage.toString() === service.garage?.toString();
      const isAssignedStaff = service.assignedStaff?.toString() === req.user._id.toString();

      if (!isAssignedToGarage && !isAssignedStaff) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this service request' });
      }
    }

    if (status) service.status = status;
    if (notes !== undefined) service.notes = notes;
    if (req.body.totalCost !== undefined) service.totalCost = req.body.totalCost;
    if (req.body.estimatedCompletionTime !== undefined) service.estimatedCompletionTime = req.body.estimatedCompletionTime;
    if (req.body.serviceImages !== undefined) service.serviceImages = req.body.serviceImages;
    if (req.body.pickupAndDrop !== undefined) service.pickupAndDrop = req.body.pickupAndDrop;
    if (req.body.pickupAddress !== undefined) service.pickupAddress = req.body.pickupAddress;
    if (req.body.dropAddress !== undefined) service.dropAddress = req.body.dropAddress;

    await service.save();

    if (req.io) {
      req.io.emit('bookingStatusChanged', { serviceId: service._id, status: service.status });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stats for staff dashboard
// @route   GET /api/staff/dashboard
// @access  Private (Staff)
exports.getDashboardStats = async (req, res) => {
  try {
    const isMechanic = req.user.role === 'mechanic';
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    const query = (isAdmin || isStaff) ? (req.user.assignedGarage ? { garage: req.user.assignedGarage } : {}) : { assignedStaff: req.user._id };

    const services = await ServiceRequest.find(query)
      .populate('user', 'name email phone')
      .populate('vehicle', 'make model year licensePlate')
      .sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalAssigned: services.length,
      pending: services.filter(s => s.status === 'Pending').length,
      inProgress: services.filter(s => s.status === 'In Progress').length,
      completed: services.filter(s => s.status === 'Completed' || s.status === 'Delivered').length,
      cancelled: services.filter(s => s.status === 'Cancelled').length,
      vehiclesInService: services.filter(s => s.status === 'In Progress' || s.status === 'Waiting for Parts').length,
      todaysAppointments: services.filter(s => {
        const bd = new Date(s.bookingDate);
        return bd >= today && bd < new Date(today.getTime() + 86400000);
      }).length,
      totalRevenue: services.filter(s => s.status === 'Completed' || s.status === 'Delivered').reduce((acc, curr) => acc + (curr.totalCost || 0), 0),
      totalCustomers: new Set(services.filter(s => s.user).map(s => s.user._id.toString())).size,
      recentBookings: services.slice(0, 5),
      garageName: req.user.assignedGarage ? await require('../models/Garage').findById(req.user.assignedGarage).then(g => g?.name) : 'Your Workspace'
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get garage team (mechanics)
// @route   GET /api/staff/team
// @access  Private (Staff)
exports.getTeam = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    if (!isAdmin && !isStaff && !req.user.assignedGarage) {
      return res.status(400).json({ success: false, message: 'You are not assigned to a garage' });
    }
    const query = { role: { $in: ['mechanic', 'staff'] } };
    // Allow seeing all mechanics globally across garages
    const mechanics = await require('../models/User').find(query).select('-password').populate('assignedGarage', 'name');
    res.json({ success: true, count: mechanics.length, data: mechanics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a mechanic to the garage
// @route   POST /api/staff/team
// @access  Private (Staff)
exports.addMechanic = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    if (!req.user.assignedGarage) {
      return res.status(400).json({ success: false, message: 'You are not assigned to a garage' });
    }
    const User = require('../models/User');
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const mechanic = await User.create({
      name, email, phone, password, role: 'mechanic', assignedGarage: req.user.assignedGarage
    });
    mechanic.password = undefined;
    res.status(201).json({ success: true, data: mechanic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a mechanic
// @route   DELETE /api/staff/team/:id
// @access  Private (Staff)
exports.removeMechanic = async (req, res) => {
  try {
    const query = { _id: req.params.id, role: 'mechanic' };
    if (req.user.role !== 'admin') {
      query.assignedGarage = req.user.assignedGarage;
    }
    const mechanic = await require('../models/User').findOneAndDelete(query);
    if (!mechanic) {
      return res.status(404).json({ success: false, message: 'Mechanic not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign service request to mechanic
// @route   PUT /api/staff/services/:id/assign
// @access  Private (Staff)
exports.assignService = async (req, res) => {
  const { mechanicId } = req.body;
  try {
    const service = await ServiceRequest.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    // Verify mechanic exists globally
    if (mechanicId) {
      const mechanic = await require('../models/User').findOne({
        _id: mechanicId,
        role: { $in: ['mechanic', 'staff'] }
      });
      if (!mechanic) {
        return res.status(404).json({ success: false, message: 'Mechanic not found' });
      }
    }

    service.assignedStaff = mechanicId || null;
    await service.save();

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers for this garage
// @route   GET /api/staff/customers
// @access  Private (Staff)
exports.getCustomers = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    if (!isAdmin && !isStaff && !req.user.assignedGarage) {
      return res.status(400).json({ success: false, message: 'Not assigned to a garage' });
    }
    const query = (isAdmin || (isStaff && !req.user.assignedGarage)) ? {} : { garage: req.user.assignedGarage };
    const services = await ServiceRequest.find(query)
      .populate('user', '-password')
      .populate('vehicle')
      .sort({ createdAt: -1 });

    const customersMap = new Map();
    services.forEach(s => {
      if (s.user && !customersMap.has(s.user._id.toString())) {
        customersMap.set(s.user._id.toString(), {
          ...s.user.toObject(),
          serviceHistory: [s],
          vehicles: s.vehicle ? [s.vehicle] : []
        });
      } else if (s.user) {
        const customer = customersMap.get(s.user._id.toString());
        customer.serviceHistory.push(s);
        if (s.vehicle && !customer.vehicles.find(v => v._id.toString() === s.vehicle._id.toString())) {
          customer.vehicles.push(s.vehicle);
        }
      }
    });

    res.json({ success: true, data: Array.from(customersMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all vehicles for this garage
// @route   GET /api/staff/vehicles
// @access  Private (Staff)
exports.getVehicles = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff';
    if (!isAdmin && !isStaff && !req.user.assignedGarage) {
      return res.status(400).json({ success: false, message: 'Not assigned to a garage' });
    }
    const query = (isAdmin || (isStaff && !req.user.assignedGarage)) ? {} : { garage: req.user.assignedGarage };
    const services = await ServiceRequest.find(query)
      .populate('user', 'name email phone')
      .populate('vehicle')
      .sort({ createdAt: -1 });

    const vehiclesMap = new Map();
    services.forEach(s => {
      if (s.vehicle && !vehiclesMap.has(s.vehicle._id.toString())) {
        vehiclesMap.set(s.vehicle._id.toString(), {
          ...s.vehicle.toObject(),
          owner: s.user,
          lastServiceDate: s.bookingDate,
          serviceHistory: [s]
        });
      } else if (s.vehicle) {
        const vehicle = vehiclesMap.get(s.vehicle._id.toString());
        vehicle.serviceHistory.push(s);
      }
    });

    res.json({ success: true, data: Array.from(vehiclesMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
