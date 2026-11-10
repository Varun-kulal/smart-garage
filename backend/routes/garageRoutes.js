const express = require('express');
const router = express.Router();
const { 
  getGarages, 
  createGarage, 
  deleteGarage,
  updateGarageTracking,
  getActiveTrackingGarages,
  getTrackingBookings
} = require('../controllers/garageController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getGarages);

router.route('/tracking/active')
  .get(getActiveTrackingGarages);

// Protected routes
router.use(protect);

router.route('/')
  .post(staffOnly, createGarage);

router.route('/:id')
  .delete(staffOnly, deleteGarage);

router.route('/:id/tracking')
  .put(staffOnly, updateGarageTracking);

router.route('/tracking/bookings')
  .get(staffOnly, getTrackingBookings);

module.exports = router;
