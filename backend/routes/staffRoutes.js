const express = require('express');
const router = express.Router();
const { getAssignedServices, updateServiceStatus, getDashboardStats, getTeam, addMechanic, removeMechanic, assignService, getCustomers, getVehicles } = require('../controllers/staffController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(staffOnly);

router.get('/dashboard', getDashboardStats);
router.get('/services', getAssignedServices);
router.put('/services/:id/status', updateServiceStatus);
router.put('/services/:id/assign', assignService);

router.get('/team', getTeam);
router.post('/team', addMechanic);
router.delete('/team/:id', removeMechanic);

router.get('/customers', getCustomers);
router.get('/vehicles', getVehicles);

module.exports = router;
