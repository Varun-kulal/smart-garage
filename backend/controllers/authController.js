const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Name must be at least 2 characters long' });
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  if (!phone || !/^\d{10}$/.test(phone.trim())) {
    return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === 'staff' ? 'staff' : 'user'
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id, 'user'),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    User Login
// @route   POST /api/auth/user/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.role === 'staff' || user.role === 'mechanic') {
        return res.status(403).json({ success: false, message: 'Please use the Staff Portal to log in.' });
      }

      res.json({
        success: true,
        token: generateToken(user._id, 'user'),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id, 'admin'),
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Garage Manager Login
// @route   POST /api/auth/garage/login
// @access  Public
exports.loginGarageManager = async (req, res) => {
  const { garageId } = req.body;

  if (!garageId) {
    return res.status(400).json({ success: false, message: 'Please select a garage' });
  }

  try {
    const user = await User.findOne({ assignedGarage: garageId, role: 'staff' });

    if (user) {
      res.json({
        success: true,
        token: generateToken(user._id, 'user'),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedGarage: user.assignedGarage,
          profileImage: user.profileImage
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'No manager assigned to this garage' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Staff Login
// @route   POST /api/auth/staff/login
// @access  Public
exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.role !== 'staff' && user.role !== 'mechanic') {
        return res.status(403).json({ success: false, message: 'Access denied. Staff only.' });
      }

      res.json({
        success: true,
        token: generateToken(user._id, 'user'),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedGarage: user.assignedGarage,
          profileImage: user.profileImage
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const userData = req.user.toObject ? req.user.toObject() : req.user;
    // Explicitly attach role from middleware to ensure it's never missing on refresh
    if (!userData.role) {
      userData.role = req.role;
    }
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private (User Only)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
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
        profileImage: updatedUser.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password (Mock Flow for Demo)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  try {
    let model = role === 'admin' ? Admin : User;
    const account = await model.findOne({ email });

    if (!account) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // In a production app, we would send an email. For this project, we return a success code.
    res.json({
      success: true,
      message: 'Password reset link sent to your email. (Use the Reset Password utility with code: 123456)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    let model = req.role === 'admin' ? Admin : User;
    const account = await model.findById(req.user._id);

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const isMatch = await account.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    account.password = newPassword;
    await account.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password (Mock Flow - updates password directly using mock token)
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword, role } = req.body;

  try {
    if (code !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid reset code' });
    }

    let Model = role === 'admin' ? Admin : User;
    const account = await Model.findOne({ email });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    account.password = newPassword;
    await account.save();

    res.json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
