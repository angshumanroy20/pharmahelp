const db = require('../models/db');

// Get user notifications
exports.getNotifications = (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching notifications', error: err.message });
      res.json({ notifications: results });
    }
  );
};

// Mark notification as read
exports.markAsRead = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (id === 'all') {
    db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating notifications', error: err.message });
      res.json({ message: 'All notifications marked as read' });
    });
  } else {
    db.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating notification', error: err.message });
      res.json({ message: 'Notification marked as read' });
    });
  }
};
