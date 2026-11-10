const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const ServiceRequest = require('../models/ServiceRequest');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).populate('assignedGarage', 'name location');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password, phone, role, assignedGarage } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, phone, role: role || 'user', assignedGarage: assignedGarage || null });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        assignedGarage: user.assignedGarage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password').sort({ name: 1 });
    res.json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { name, email, phone, assignedGarage } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (assignedGarage !== undefined) {
      user.assignedGarage = assignedGarage || null;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        assignedGarage: updatedUser.assignedGarage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user and cascade delete vehicles, service requests, recognitions
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Cascade delete related records
    await Vehicle.deleteMany({ owner: user._id });
    await ServiceRequest.deleteMany({ user: user._id });
    
    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
