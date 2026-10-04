const db = require('../models/db');

exports.getDashboardStats = async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'pharmacist' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const queryAsync = (sql, params = []) => {
    return new Promise((resolve) => {
      db.query(sql, params, (err, result) => {
        if (err) {
          console.warn('Dashboard query error for:', sql, err.message);
          return resolve([{ val: 0 }]);
        }
        resolve(result);
      });
    });
  };

  try {
    const rUsers = await queryAsync('SELECT COUNT(*) AS val FROM users');
    const rPatients = await queryAsync("SELECT COUNT(*) AS val FROM users WHERE role = 'patient'");
    const rDoctors = await queryAsync("SELECT COUNT(*) AS val FROM users WHERE role = 'doctor'");
    const rPharmacists = await queryAsync("SELECT COUNT(*) AS val FROM users WHERE role = 'pharmacist'");

    const rMeds = await queryAsync('SELECT COUNT(*) AS val FROM medicines');
    const rLowStock = await queryAsync('SELECT COUNT(*) AS val FROM medicines WHERE stock < 10');

    const rPrescriptions = await queryAsync('SELECT COUNT(*) AS val FROM prescriptions');
    const rPrescVerified = await queryAsync('SELECT COUNT(*) AS val FROM prescriptions WHERE is_verified = 1');
    const rPrescUnverified = await queryAsync('SELECT COUNT(*) AS val FROM prescriptions WHERE is_verified = 0 OR is_verified IS NULL');

    const rSideEffects = await queryAsync('SELECT COUNT(*) AS val FROM side_effects');
    const rSideEffVerified = await queryAsync('SELECT COUNT(*) AS val FROM side_effects WHERE is_verified = 1');
    const rSideEffPending = await queryAsync('SELECT COUNT(*) AS val FROM side_effects WHERE is_verified = 0 OR is_verified IS NULL');

    const rOrders = await queryAsync('SELECT COUNT(*) AS val, COALESCE(SUM(total_amount), 0) AS revenue FROM orders');
    const rOrdersPending = await queryAsync("SELECT COUNT(*) AS val FROM orders WHERE status = 'pending' OR status = 'processing'");

    const rAppointments = await queryAsync('SELECT COUNT(*) AS val FROM appointments');

    const stats = {
      total_users: rUsers[0]?.val || 0,
      total_patients: rPatients[0]?.val || 0,
      total_doctors: rDoctors[0]?.val || 0,
      total_pharmacists: rPharmacists[0]?.val || 0,

      total_medicines: rMeds[0]?.val || 0,
      low_stock_medicines: rLowStock[0]?.val || 0,

      total_prescriptions: rPrescriptions[0]?.val || 0,
      verified_prescriptions: rPrescVerified[0]?.val || 0,
      unverified_prescriptions: rPrescUnverified[0]?.val || 0,

      total_side_effects: rSideEffects[0]?.val || 0,
      verified_side_effects: rSideEffVerified[0]?.val || 0,
      pending_side_effects: rSideEffPending[0]?.val || 0,

      total_orders: rOrders[0]?.val || 0,
      total_revenue: parseFloat(rOrders[0]?.revenue || 0).toFixed(2),
      pending_orders: rOrdersPending[0]?.val || 0,

      total_appointments: rAppointments[0]?.val || 0
    };

    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Error compiling dashboard statistics' });
  }
};
