const express = require('express');
const router = express.Router();
const { createSOS, getSOSAlerts, updateSOSStatus } = require('../controllers/sosController');
const { protect, adminOnly, staffOnly } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createSOS);

// Admin/Staff routes
router.get('/', protect, staffOnly, getSOSAlerts);
router.put('/:id/status', protect, staffOnly, updateSOSStatus);

module.exports = router;
