const Notification = require('../models/Notification');

// Get notifications for current user (including general broadcast notifications)
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { user: req.user._id },
        { user: null } // broadcast notifications
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Auth check (if targeted)
    if (notification.user && notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create notifications (Admin Only)
exports.createNotification = async (req, res) => {
  const { userId, title, message, type } = req.body; // If userId is null, it is a broadcast notification

  try {
    const notification = await Notification.create({
      user: userId || null,
      title,
      message,
      type: type || 'Info'
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Admin can delete any, user can delete their own
    if (req.role !== 'admin' && notification.user && notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
