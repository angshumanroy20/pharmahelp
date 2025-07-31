const db = require('../models/db');

exports.getUserPrescriptions = (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT id, doctor, date, file_url FROM prescriptions WHERE patient_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      db.query('SELECT name, email FROM users WHERE id = ?', [userId], (err2, userResult) => {
        if (err2) return res.status(500).json({ message: 'User error', error: err2 });
        res.json({ user: userResult[0], prescriptions: results });
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
    'INSERT INTO prescriptions (patient_id, doctor, date, file_url, filename) VALUES (?, ?, ?, ?, ?)',
    [patientId, doctor || null, date || new Date(), file_url, filename],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Prescription uploaded successfully' });
    }
  );
};

exports.getMyPrescriptions = (req, res) => {
  const patientId = req.user.id;

  db.query(
    'SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY uploaded_at DESC',
    [patientId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ prescriptions: results });
    }
  );
};

exports.verifyPrescription = (req, res) => {
  const { id } = req.params;

  db.query(
    'UPDATE prescriptions SET is_verified = 1 WHERE id = ?',
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Prescription verified' });
    }
  );
};



  exports.getAllPrescriptions = (req, res) => {
    if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    const query = `
      SELECT p.id, u.name AS patient_name, p.doctor, p.date, p.file_url
      FROM prescriptions p
      JOIN users u ON p.patient_id = u.id
      ORDER BY p.date DESC
    `;
  
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.json({ prescriptions: results });
    });
  };
  