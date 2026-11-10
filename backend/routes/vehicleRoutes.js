const express = require('express');
const router = express.Router();
const {
  getMyVehicles,
  getAllVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(addVehicle)
  .get(adminOnly, getAllVehicles);

router.get('/my', getMyVehicles);

router.route('/:id')
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;
