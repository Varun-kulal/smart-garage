const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');

// ================= MASTER SERVICE OFFERINGS =================

// Get all service options
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new master service type (Admin Only)
exports.createService = async (req, res) => {
  const { name, description, basePrice, estimatedDuration, category } = req.body;
  try {
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ success: false, message: 'Service with this name already exists' });
    }

    const service = await Service.create({
      name,
      description,
      basePrice,
      estimatedDuration,
      category
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a master service type (Admin Only)
exports.updateService = async (req, res) => {
  const { name, description, basePrice, estimatedDuration, category } = req.body;
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.basePrice = basePrice !== undefined ? basePrice : service.basePrice;
    service.estimatedDuration = estimatedDuration || service.estimatedDuration;
    service.category = category || service.category;

    const updatedService = await service.save();
    res.json({ success: true, data: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a master service type (Admin Only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Cascade delete/clean requests that use it
    await ServiceRequest.deleteMany({ service: service._id });
    await Service.findByIdAndDelete(service._id);

    res.json({ success: true, message: 'Service type and associated booking records deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User books a service
exports.createServiceRequest = async (req, res) => {
  const { vehicleId, serviceId, garageId, bookingDate, preferredTime, notes, totalCost, pickupAndDrop, pickupAddress, dropAddress } = req.body;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service category not found' });
    }

    const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or unauthorized' });
    }

    if (!garageId) {
      return res.status(400).json({ success: false, message: 'Garage selection is required' });
    }
    const Garage = require('../models/Garage');
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ success: false, message: 'Selected garage location not found' });
    }

    // Validation for booking date
    if (!bookingDate) {
      return res.status(400).json({ success: false, message: 'Booking date is required' });
    }
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ success: false, message: 'Booking date cannot be in the past' });
    }

    if (!preferredTime) {
      return res.status(400).json({ success: false, message: 'Preferred time slot is required' });
    }

    const request = await ServiceRequest.create({
      user: req.user._id,
      vehicle: vehicleId,
      service: serviceId,
      garage: garageId,
      bookingDate,
      preferredTime,
      notes: notes || '',
      totalCost: totalCost || service.basePrice,
      pickupAndDrop: pickupAndDrop || false,
      pickupAddress: pickupAddress || '',
      dropAddress: dropAddress || ''
    });

    // Create a notification for the user
    await Notification.create({
      user: req.user._id,
      title: 'Service Request Created',
      message: `Your booking request for ${service.name} has been submitted. Status: Pending.`,
      type: 'Info'
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get current user's service bookings
exports.getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id })
      .populate('vehicle')
      .populate('service')
      .populate('garage')
      .populate('assignedStaff', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all service bookings (Admin Only)
exports.getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('user', 'name email phone')
      .populate('vehicle')
      .populate('service')
      .populate('garage')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update request status / Approve / Reject (Admin Only)
// Delete a booking (User Only)
exports.deleteServiceRequest = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    // If not an admin, restrict deletion to their own requests
    if (req.role !== 'admin') {
      query.user = req.user._id;
    }

    const request = await ServiceRequest.findOne(query);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Booking not found or unauthorized' });
    }
    await ServiceRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServiceRequestStatus = async (req, res) => {
  const { status, notes, totalCost, assignedStaff, pickupAndDrop, pickupAddress, dropAddress } = req.body;

  try {
    let request = await ServiceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service booking request not found' });
    }

    const previousStatus = request.status;
    request.status = status || request.status;
    request.notes = notes !== undefined ? notes : request.notes;
    request.totalCost = totalCost !== undefined ? totalCost : request.totalCost;
    
    if (pickupAndDrop !== undefined) request.pickupAndDrop = pickupAndDrop;
    if (pickupAddress !== undefined) request.pickupAddress = pickupAddress;
    if (dropAddress !== undefined) request.dropAddress = dropAddress;
    
    // Only Admin can assign staff
    if (req.role === 'admin' && assignedStaff !== undefined) {
      request.assignedStaff = assignedStaff || null;
    }

    await request.save();

    // Populate for response and notification
    request = await ServiceRequest.findById(req.params.id)
      .populate('service')
      .populate('user')
      .populate('garage')
      .populate('assignedStaff', 'name email');

    // If status transitioned to Completed, update the vehicle lastServiceDate
    if (status === 'Completed' && previousStatus !== 'Completed') {
      await Vehicle.findByIdAndUpdate(request.vehicle, {
        lastServiceDate: new Date(),
        // Increment mileage slightly for simulation
        $inc: { mileage: 250 }
      });
    }

    // Trigger alert notification for user
    await Notification.create({
      user: request.user._id,
      title: `Service Booking Status: ${status}`,
      message: `Your appointment for ${request.service.name} has been marked as ${status}.`,
      type: status === 'Cancelled' ? 'Warning' : 'Info'
    });

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
