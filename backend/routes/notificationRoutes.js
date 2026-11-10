const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  createNotification,
  deleteNotification
} = require('../controllers/notificationController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMyNotifications)
  .post(staffOnly, createNotification);

router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
