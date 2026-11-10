const express = require('express');
const router = express.Router();
const { 
  submitRequest, 
  getRequests, 
  updateRequestStatus, 
  deleteRequest 
} = require('../controllers/partnerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for garage owners to submit partnership requests
router.post('/', submitRequest);

// Admin only routes
router.use(protect, adminOnly);
router.route('/')
  .get(getRequests);

router.route('/:id')
  .delete(deleteRequest);

router.route('/:id/status')
  .put(updateRequestStatus);

module.exports = router;
