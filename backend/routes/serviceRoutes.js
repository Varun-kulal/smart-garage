const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest
} = require('../controllers/serviceController');
const { protect, adminOnly, staffOnly } = require('../middleware/authMiddleware');

router.use(protect);

// Master Services routes
router.route('/')
  .get(getServices)
  .post(adminOnly, createService);

router.route('/:id')
  .put(adminOnly, updateService)
  .delete(adminOnly, deleteService);

// Bookings routes
router.route('/bookings')
  .get(adminOnly, getAllServiceRequests) // Admin fetches all service requests
  .post(createServiceRequest);          // Customer books a service

router.route('/bookings/my')
  .get(getMyServiceRequests);           // Customer fetches their own bookings

// Admin/Staff Action on individual booking status / costs
router.route('/bookings/:id')
  .put(staffOnly, updateServiceRequestStatus)
  .delete(deleteServiceRequest);

module.exports = router;
