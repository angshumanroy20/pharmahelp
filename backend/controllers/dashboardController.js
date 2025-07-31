const db = require('../models/db');

exports.getDashboardStats = (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'pharmacist') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const stats = {};

  const queries = [
    ['SELECT COUNT(*) AS total_users FROM users', 'total_users'],
    ['SELECT COUNT(*) AS total_medicines FROM medicines', 'total_medicines'],
    ['SELECT COUNT(*) AS verified_prescriptions FROM prescriptions WHERE is_verified = 1', 'verified_prescriptions'],
    ['SELECT COUNT(*) AS unverified_prescriptions FROM prescriptions WHERE is_verified = 0', 'unverified_prescriptions']
  ];

  let completed = 0;

  queries.forEach(([sql, key]) => {
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });

      stats[key] = result[0][key];
      completed++;

      if (completed === queries.length) {
        res.json(stats);
      }
    });
  });
};
