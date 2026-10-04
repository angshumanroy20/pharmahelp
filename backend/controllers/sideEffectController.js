const db = require('../models/db');

exports.reportSideEffect = (req, res) => {
  const patientId = req.user.id;
  const { symptom } = req.body;

  if (!symptom || symptom.trim() === '') {
    return res.status(400).json({ message: 'Symptom description is required' });
  }

  db.query(
    'INSERT INTO side_effects (patient_id, symptom, date_reported, is_verified) VALUES (?, ?, CURDATE(), 0)',
    [patientId, symptom.trim()],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error reporting side effect', error: err.message });

      // Notify patient
      db.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, 'Side Effect Logged', 'Your side-effect report has been forwarded to the clinical pharmacist and physician.', 'side_effect')`,
        [patientId]
      );

      res.status(201).json({ message: 'Reported successfully. Our clinical team will review it promptly.' });
    }
  );
};

exports.getAllSideEffects = (req, res) => {
  const sql = `
    SELECT se.id, se.patient_id, u.name AS patient_name, u.email AS patient_email,
           se.symptom, se.date_reported, se.pharmacist_reply, se.is_verified, se.doctor_reply, se.verified_by
    FROM side_effects se
    JOIN users u ON se.patient_id = u.id
    ORDER BY se.date_reported DESC, se.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch side effects', error: err.message });
    res.json({ reports: results });
  });
};

exports.getReportsForAdmin = (req, res) => {
  return exports.getAllSideEffects(req, res);
};

exports.replyToReport = (req, res) => {
  if (req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { reply } = req.body;

  if (!reply || reply.trim() === '') {
    return res.status(400).json({ message: 'Reply content is required' });
  }

  db.query(
    'UPDATE side_effects SET pharmacist_reply = ? WHERE id = ?',
    [reply.trim(), id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Reply failed', error: err.message });

      // Notify patient
      db.query('SELECT patient_id FROM side_effects WHERE id = ?', [id], (err2, rows) => {
        if (!err2 && rows.length > 0) {
          db.query(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, 'Pharmacist Replied', 'A clinical pharmacist has responded to your side effect report.', 'side_effect')`,
            [rows[0].patient_id]
          );
        }
      });

      res.json({ message: 'Pharmacist response recorded successfully' });
    }
  );
};

exports.verifyAndReply = (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { id } = req.params;
  const { reply } = req.body;
  const doctorId = req.user.id;

  db.query(
    'UPDATE side_effects SET is_verified = 1, doctor_reply = ?, verified_by = ? WHERE id = ?',
    [reply, doctorId, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Verification failed', error: err.message });

      // Notify patient
      db.query('SELECT patient_id FROM side_effects WHERE id = ?', [id], (err2, rows) => {
        if (!err2 && rows.length > 0) {
          db.query(
            `INSERT INTO notifications (user_id, title, message, type)
             VALUES (?, 'Doctor Verified Side Effect', 'Dr. has evaluated and verified your symptom report.', 'side_effect')`,
            [rows[0].patient_id]
          );
        }
      });

      res.json({ message: 'Report verified and clinical guidance issued' });
    }
  );
};
