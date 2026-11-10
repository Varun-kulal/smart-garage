const Vehicle = require('../models/Vehicle');
const ServiceRequest = require('../models/ServiceRequest');

// Get current user's vehicles
exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all vehicles (Admin Only)
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a vehicle (User Only)
exports.addVehicle = async (req, res) => {
  const { make, model, year, licensePlate, vin, mileage } = req.body;

  if (!make || make.trim() === '') {
    return res.status(400).json({ success: false, message: 'Vehicle make/brand is required' });
  }
  if (!model || model.trim() === '') {
    return res.status(400).json({ success: false, message: 'Vehicle model is required' });
  }
  const currentYear = new Date().getFullYear();
  const parsedYear = Number(year);
  if (isNaN(parsedYear) || parsedYear < 1990 || parsedYear > currentYear + 1) {
    return res.status(400).json({ success: false, message: `Vehicle year must be between 1990 and ${currentYear + 1}` });
  }
  if (!licensePlate || licensePlate.trim() === '') {
    return res.status(400).json({ success: false, message: 'License plate is required' });
  }
  if (vin && vin.trim() !== '' && vin.trim().length !== 17) {
    return res.status(400).json({ success: false, message: 'VIN must be exactly 17 characters' });
  }
  const parsedMileage = Number(mileage);
  if (mileage !== undefined && (isNaN(parsedMileage) || parsedMileage < 0)) {
    return res.status(400).json({ success: false, message: 'Mileage must be a positive number' });
  }

  try {
    // Check if vehicle already exists for this user by license plate
    let vehicle = await Vehicle.findOne({ owner: req.user._id, licensePlate });
    
    if (vehicle) {
      // If it exists, update it to the new make and model from the wizard
      vehicle.make = make;
      vehicle.model = model;
      vehicle.year = year;
      if (vin) vehicle.vin = vin;
      await vehicle.save();

      return res.status(200).json({ success: true, data: vehicle, message: 'Existing vehicle updated' });
    }

    // Otherwise, create a new one
    vehicle = await Vehicle.create({
      owner: req.user._id,
      make,
      model,
      year,
      licensePlate,
      vin,
      mileage
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  const { make, model, year, licensePlate, vin, mileage, status, lastServiceDate, garage } = req.body;

  if (make !== undefined && make.trim() === '') {
    return res.status(400).json({ success: false, message: 'Vehicle make/brand cannot be empty' });
  }
  if (model !== undefined && model.trim() === '') {
    return res.status(400).json({ success: false, message: 'Vehicle model cannot be empty' });
  }
  if (year !== undefined) {
    const currentYear = new Date().getFullYear();
    const parsedYear = Number(year);
    if (isNaN(parsedYear) || parsedYear < 1990 || parsedYear > currentYear + 1) {
      return res.status(400).json({ success: false, message: `Vehicle year must be between 1990 and ${currentYear + 1}` });
    }
  }
  if (licensePlate !== undefined && licensePlate.trim() === '') {
    return res.status(400).json({ success: false, message: 'License plate cannot be empty' });
  }
  if (vin && vin.trim() !== '' && vin.trim().length !== 17) {
    return res.status(400).json({ success: false, message: 'VIN must be exactly 17 characters' });
  }
  if (mileage !== undefined) {
    const parsedMileage = Number(mileage);
    if (isNaN(parsedMileage) || parsedMileage < 0) {
      return res.status(400).json({ success: false, message: 'Mileage must be a positive number' });
    }
  }

  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Authorization: User must own the vehicle, or must be an admin/staff
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this vehicle' });
    }

    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.licensePlate = licensePlate || vehicle.licensePlate;
    vehicle.vin = vin !== undefined ? vin : vehicle.vin;
    vehicle.mileage = mileage !== undefined ? mileage : vehicle.mileage;
    vehicle.lastServiceDate = lastServiceDate !== undefined ? lastServiceDate : vehicle.lastServiceDate;
    if (garage !== undefined) {
      vehicle.garage = garage || null;
    }
    
    if (status !== undefined && req.role === 'admin') {
      vehicle.status = status;
    }

    const updatedVehicle = await vehicle.save();
    res.json({ success: true, data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Authorization: User must own the vehicle, or must be an admin
    if (req.role !== 'admin' && vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this vehicle' });
    }

    // Cascade delete service requests for this vehicle
    await ServiceRequest.deleteMany({ vehicle: vehicle._id });
    
    await Vehicle.findByIdAndDelete(vehicle._id);

    res.json({ success: true, message: 'Vehicle and its associated service records deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
