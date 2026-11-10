const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getStaff
} = require('../controllers/userController');
const { protect, adminOnly, staffOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/staff')
  .get(staffOnly, getStaff);

router.route('/')
  .get(staffOnly, getUsers)
  .post(adminOnly, createUser);

router.route('/:id')
  .put(adminOnly, updateUser)
  .delete(adminOnly, deleteUser);

module.exports = router;
