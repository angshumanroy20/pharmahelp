const db = require('../models/db');

exports.getUserPrescriptions = (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT id, doctor, date, file_url, is_verified, uploaded_at FROM prescriptions WHERE patient_id = ? ORDER BY date DESC, uploaded_at DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });

      db.query('SELECT name, email, role FROM users WHERE id = ?', [userId], (err2, userResult) => {
        if (err2) return res.status(500).json({ message: 'User error', error: err2.message });
        res.json({ user: userResult[0] || {}, prescriptions: results });
      });
    }
  );
};

exports.uploadPrescription = (req, res) => {
  const patientId = req.user.id;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const filename = file.filename;
  const file_url = `/uploads/prescriptions/${filename}`;
  const { doctor, date } = req.body;

  db.query(
    'INSERT INTO prescriptions (patient_id, doctor, date, file_url, filename, is_verified) VALUES (?, ?, ?, ?, ?, 0)',
    [patientId, doctor || 'Consulting Physician', date || new Date(), file_url, filename],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Upload failed', error: err.message });

      // Create notification
      db.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, 'Prescription Uploaded', 'Your prescription has been submitted for pharmacist verification.', 'prescription')`,
        [patientId]
      );

      res.status(201).json({
        message: 'Prescription uploaded successfully',
        prescription: {
          id: result.insertId,
          doctor,
          date,
          file_url,
          is_verified: 0
        }
      });
    }
  );
};

exports.getMyPrescriptions = (req, res) => {
  const patientId = req.user.id;

  db.query(
    'SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY uploaded_at DESC',
    [patientId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching prescriptions', error: err.message });
      res.json({ prescriptions: results });
    }
  );
};

exports.verifyPrescription = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;

  db.query('UPDATE prescriptions SET is_verified = 1 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Verification error', error: err.message });

    // Notify patient
    db.query('SELECT patient_id FROM prescriptions WHERE id = ?', [id], (err2, rows) => {
      if (!err2 && rows.length > 0) {
        db.query(
          `INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, 'Prescription Verified', 'Your medical prescription #${id} has been verified by the pharmacist.', 'prescription')`,
          [rows[0].patient_id]
        );
      }
    });

    res.json({ message: `Prescription #${id} verified successfully` });
  });
};

exports.getAllPrescriptions = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = `
    SELECT p.id, u.name AS patient_name, u.email AS patient_email, p.doctor, p.date, p.file_url, p.is_verified, p.uploaded_at
    FROM prescriptions p
    JOIN users u ON p.patient_id = u.id
    ORDER BY p.date DESC, p.uploaded_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json({ prescriptions: results });
  });
};