const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  loginAdmin,
  loginGarageManager,
  loginStaff,
  getProfile,
  updateProfile,
  forgotPassword,
  changePassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public auth routes
router.post('/register', registerUser);
router.post('/user/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/garage/login', loginGarageManager);
router.post('/staff/login', loginStaff);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
